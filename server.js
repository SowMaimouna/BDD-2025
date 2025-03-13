const express = require("express");
const multer = require("multer");
const mysql = require("mysql2");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());


const upload = multer({ dest: "uploads/" });


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


function convertDate(dateString) {
  const parts = dateString.split("/");
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`; 
  }
  return dateString;
}


app.post("/upload", upload.single("file"), async (req, res) => {
  console.log("Tentative d'upload...");

  if (!req.file || !req.body.checksum) {
    console.error("Fichier ou empreinte SHA-256 manquante");
    return res.status(400).json({ message: "Fichier ou empreinte SHA-256 manquante" });
  }

  console.log("Fichier reçu :", req.file.originalname);


  let fileContent = fs.readFileSync(req.file.path, "utf8");
  let cleanedContent = fileContent.replace(/\uFEFF/g, "").trim();

  
  let separator = cleanedContent.includes(";") ? ";" : ",";
  console.log(`Séparateur détecté : "${separator}"`);

  let rows = cleanedContent.split(/\r?\n/).map((row) => row.split(separator));

  
  const headers = rows.shift();
  console.log("En-têtes détectés :", headers);

  for (const row of rows) {
    if (row.length !== 5) {
      console.warn("Donnée incomplète ignorée :", row);
      continue;
    }

   
    let cleanedRow = row.map(val => val.replace(/^"|"$/g, '').trim());

    
    const [nom, bureau_vote, numero_carte_identite, numero_carte_electeur, raw_date_naissance] = cleanedRow;
    const date_naissance = convertDate(raw_date_naissance); 

    const prenom = null;
    const telephone = null;
    const email = null;
    const code_authentification = null;

    
    if (!nom || !bureau_vote || !numero_carte_identite || !numero_carte_electeur || !date_naissance) {
      console.warn("Donnée incorrecte ignorée :", cleanedRow);
      continue;
    }

    
    db.query(
      "INSERT INTO electeurs (nom, prenom, bureau_vote, numero_carte_identite, numero_carte_electeur, date_naissance, telephone, email, code_authentification) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [nom, prenom, bureau_vote, numero_carte_identite, numero_carte_electeur, date_naissance, telephone, email, code_authentification],
      (err) => {
        if (err) {
          console.error("Erreur lors de l'insertion :", err);
        } else {
          console.log("Insertion réussie :", { nom, date_naissance });
        }
      }
    );
  }

  res.json({ message: "Importation réussie et validation effectuée !" });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));
