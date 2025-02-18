// const express = require("express");
// const cors = require("cors");

// const app = express();
// const PORT = 5000;

// // Middleware pour autoriser les requêtes CORS
// app.use(cors());

// // Pour gérer les données envoyées en form-data (fichiers, champs, etc.)
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Route pour l'upload
// app.post("/upload", (req, res) => {
//   console.log("Requête d'upload reçue");
//   // Ici, tu peux traiter le fichier et le checksum.
//   // Pour l'instant, on renvoie une réponse fictive.
//   res.json({ message: "Fichier uploadé avec succès (réponse mock)" });
// });

// // Démarrage du serveur
// app.listen(PORT, () => {
//   console.log(`Serveur démarré sur http://localhost:${PORT}`);
// });

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const multer = require("multer");
const csvParser = require("csv-parser");
const stream = require("stream");

const app = express();
const PORT = 5000;

// Activer CORS pour autoriser les requêtes depuis le front-end
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Utiliser la mémoire pour stocker le fichier (on ne le sauvegarde pas sur disque)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Configuration de la connexion à MySQL
const connection = mysql.createConnection({
  host: "localhost",        // Adresse du serveur MySQL (souvent localhost)
  user: "root",  // Remplace par ton nom d'utilisateur MySQL
  password: "", // Remplace par ton mot de passe MySQL
  database: "parrainage"        // Remplace par le nom de ta base de données
});

connection.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à MySQL :", err);
    return;
  }
  console.log("Connecté à MySQL");
});

  //Route pour uploader le fichier CSV et insérer les données en base
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Aucun fichier uploadé." });
  }

  const results = [];
  // Convertir le buffer du fichier en flux et le parser avec csv-parser
  const bufferStream = new stream.PassThrough();
  bufferStream.end(req.file.buffer);

  bufferStream
    .pipe(csvParser())
    .on("data", (data) => {
      // On suppose que le CSV possède les colonnes nom, bureau_de_vote, numero_carte_electeur, CIN
      results.push(data);
    })
    .on("end", () => {
      if (results.length === 0) {
        return res.status(400).json({ error: "Le fichier CSV est vide ou mal formaté." });
      }

      // Préparer les valeurs à insérer en base
      // Chaque ligne doit contenir : [nom, bureau_de_vote, numero_carte_electeur, CIN]
      const values = results.map(row => [
        row.nom,
        row.bureau_vote,
        row.numero_carte_identite,
        row.numero_carte_electeur
      ]);

      // Insertion multiple en base
      const sql = "INSERT INTO electeurs (nom, bureau_vote, numero_carte_identite, numero_carte_electeur) VALUES ?";
      connection.query(sql, [values], (err, result) => {
        if (err) {
          console.error("Erreur lors de l'insertion en base :", err);
          return res.status(500).json({ error: err.message });
        }
        res.json({
          message: "Données insérées avec succès",
          inserted: result.affectedRows
        });
      });
    })
    .on("error", (err) => {
      console.error("Erreur lors du parsing du CSV :", err);
      res.status(500).json({ error: "Erreur lors du parsing du CSV" });
    });
});

// Route pour récupérer les données insérées (facultatif)
app.get("/electeurs", (req, res) => {
  connection.query("SELECT * FROM electeurs", (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des données :", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

