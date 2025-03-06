const express = require("express");
const multer = require("multer");
const mysql = require("mysql2");
const crypto = require("crypto");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());


const upload = multer({ dest: "uploads/" });

// Connexion à MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", 
  database: "parrainage_v2"

});


db.connect((err) => {
  if (err) {
    console.error("Erreur de connexion MySQL :", err);
    process.exit(1);
  } else {
    console.log("Connecté à MySQL !");
  }
});


app.post("/upload", upload.single("file"), async (req, res) => {
  console.log("Tentative d'upload...");

  if (!req.file || !req.body.checksum) {
    console.error("Fichier ou empreinte SHA-256 manquante");
    return res.status(400).json({ message: "Fichier ou empreinte SHA-256 manquante" });
  }

  console.log("Fichier reçu :", req.file.originalname);

 
  let fileContent = fs.readFileSync(req.file.path, "utf8");
  let cleanedContent = fileContent.replace(/\uFEFF/g, "").trim();

  
  let separator = ","; 
  // let separator = cleanedContent.includes(";") ? ";" : ",";


  let rows = cleanedContent.split(/\r?\n/).map((row) => row.split(separator));

 
  rows.shift();

  for (const row of rows) {
   
    if (row.length !== 4) {
      console.warn("Donnée incomplète ignorée :", row);
      continue;
    }

    // Nettoyer les valeurs et attribuer NULL aux colonnes absentes dans le fichier CSV
    const [nom, bureau_vote, numero_carte_identite, numero_carte_electeur] = row.map((val) => val.trim());
    const prenom = null; 
    const telephone = null;
    const email = null;
    const code_authentification = null;

    // Vérifier que toutes les données obligatoires sont valides
    if (!nom || !bureau_vote || !numero_carte_identite || !numero_carte_electeur) {
      console.warn("Donnée incorrecte ignorée :", row);
      continue;
    }

    // Insérer dans la base de données
    db.query(
      "INSERT INTO electeurs (nom, prenom, bureau_vote, numero_carte_identite, numero_carte_electeur, telephone, email,date_inscription, code_authentification) VALUES (?, ?, ?, ?, ?,)",
      [nom, prenom, bureau_vote, numero_carte_identite, numero_carte_electeur, telephone, email,  code_authentification],
      (err) => {
        if (err) {
          console.error("Erreur lors de l'insertion :", err);
        } else {
          console.log("Insertion réussie :", row);
        }
      }
    );
  }

  res.json({ message: "Importation réussie et validation effectuée !" });
});

// Lancer le serveur
const PORT = 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));












