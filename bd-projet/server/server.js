require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const nodemailer = require("nodemailer");

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

  if (!numElecteur || !numCNI || !nom || !bureauVote) {
    return res.status(400).json({ error: "Tous les champs sont obligatoires" });
  }

  const query = `SELECT * FROM electeurs WHERE numero_carte_electeur = ? AND numero_carte_identite = ? AND nom = ? AND bureau_vote = ?`;
  
  db.query(query, [numElecteur, numCNI, nom, bureauVote], (err, result) => {
    if (err) return res.status(500).json({ error: "Erreur serveur" });
    if (result.length > 0) return res.json({ valid: true });
    res.json({ valid: false });
  });
});

// Enregistrement de l’électeur et envoi du code OTP
app.post("/register-elector", (req, res) => {
  const { numElecteur, prenom, email, telephone } = req.body;

  if (!numElecteur || !prenom || !email || !telephone) {
    return res.status(400).json({ error: "Tous les champs sont obligatoires" });
  }

  const codeOTP = Math.floor(100000 + Math.random() * 900000);

  const query = `UPDATE electeurs SET prenom = ?, email = ?, telephone = ?, code_authentification = ? WHERE numero_carte_electeur = ?`;
  db.query(query, [prenom, email, telephone, codeOTP, numElecteur], async (err) => {
    if (err) return res.status(500).json({ error: "Erreur lors de l'inscription" });

    console.log("Mise à jour réussie pour l'électeur :", numElecteur);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, //Utilisation des variables d'environnement
        pass: process.env.EMAIL_PASS,  
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Code de vérification",
      text: `Votre code de vérification est : ${codeOTP}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Email envoyé !");
      res.json({ success: true });
    } catch (error) {
      console.error("Erreur d’envoi d’email:", error.message);
      res.status(500).json({ error: "Échec d’envoi de l’email" });
    }
  });
});

// Vérifier les identifiants de l’électeur et récupérer ses infos
app.post("/login-elector", (req, res) => {
  const { numElecteur, numCNI } = req.body;

  if (!numElecteur || !numCNI) {
    return res.status(400).json({ error: "Champs obligatoires" });
  }

  const query = `SELECT nom, prenom, date_naissance, bureau_vote FROM electeurs WHERE numero_carte_electeur = ? AND numero_carte_identite = ?`;

  db.query(query, [numElecteur, numCNI], (err, result) => {
    if (err) return res.status(500).json({ error: "Erreur serveur" });

    if (result.length > 0) {
      res.json({ success: true, elector: result[0] });
    } else {
      res.json({ success: false, error: "Informations incorrectes" });
    }
  });
});

// Vérifier le code OTP
app.post("/verify-otp", (req, res) => {
  const { numElecteur, code } = req.body;

  if (!numElecteur || !code) {
    return res.status(400).json({ error: "Champs obligatoires" });
  }

  const query = `SELECT * FROM electeurs WHERE numero_carte_electeur = ? AND code_authentification = ?`;

  db.query(query, [numElecteur, code], (err, result) => {
    if (err) return res.status(500).json({ error: "Erreur serveur" });

    if (result.length > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false, error: "Code incorrect" });
    }
  });
});



app.listen(5000, () => console.log("Serveur démarré sur le port 5000"));
