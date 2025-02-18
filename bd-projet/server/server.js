require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const twilio = require("twilio");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "parrainage",
  port: "3307",
});

db.connect((err) => {
  if (err) console.error("Erreur de connexion à MySQL:", err);
  else console.log("Connecté à MySQL");
});

// Vérification de l’électeur
app.post("/verify-elector", (req, res) => {
  const { numElecteur, numCNI, nom, bureauVote } = req.body;
  const query = `SELECT * FROM electeurs WHERE numero_carte_electeur = ? AND numero_carte_identite = ? AND nom = ? AND bureau_vote = ?`;
  
  db.query(query, [numElecteur, numCNI, nom, bureauVote], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length > 0) res.json({ valid: true });
    else res.json({ valid: false });
  });
});

// Enregistrement de l’électeur et envoi du code OTP
app.post("/register-elector", (req, res) => {
  const { numElecteur, email, telephone } = req.body;
  const codeOTP = Math.floor(100000 + Math.random() * 900000);

  const query = `UPDATE electeurs SET email = ?, telephone = ?, code_authentification = ? WHERE numero_carte_electeur = ?`;
  db.query(query, [email, telephone, codeOTP, numElecteur], async (err) => {
    if (err) return res.status(500).json({ error: err });

    // Envoi du code OTP par Twilio
    const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
    try {
      await client.messages.create({
        body: `Votre code de vérification: ${codeOTP}`,
        from: process.env.TWILIO_PHONE,
        to: telephone,
      });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Échec d’envoi du SMS" });
    }
  });
});
app.post("/verify-otp", (req, res) => {
    const { numElecteur, code } = req.body;
    const query = `SELECT * FROM electeurs WHERE numero_carte_electeur = ? AND code_authentification = ?`;
    
    db.query(query, [numElecteur, code], (err, result) => {
      if (err) return res.status(500).json({ error: err });
      if (result.length > 0) res.json({ success: true });
      else res.json({ success: false });
    });
  });
  

app.listen(5000, () => console.log("Serveur démarré sur le port 5000"));
