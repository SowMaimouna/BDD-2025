const express = require('express');
const multer = require('multer');
const fs = require('fs');
const Papa = require('papaparse'); 
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'parrainage'
});

db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
  } else {
    console.log('Connecté à la base de données MySQL');
  }
});

// Endpoint pour récupérer les électeurs
app.get('/electeurs', (req, res) => {
  const query = 'SELECT * FROM temp_import_electeurs';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send('Erreur lors de la récupération des électeurs');
    }
    res.json(results);
  });
});

// Endpoint pour uploader un fichier CSV
app.post('/upload', upload.single('file'), (req, res) => {
  const filePath = req.file.path;

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Erreur lors de la lecture du fichier');
    }

    Papa.parse(data, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const rows = result.data;

        rows.forEach((row) => {
          const { nom, prenom, numero_carte_identite, telephone, email, date_naissance } = row;

          const query = 'INSERT INTO temp_import_electeurs (nom, prenom, numero_carte_identite, telephone, email, date_naissance, statut_import) VALUES (?, ?, ?, ?, ?, ?, "EN_ATTENTE")';
          db.query(query, [nom, prenom, numero_carte_identite, telephone, email, date_naissance], (err, result) => {
            if (err) {
              console.error('Erreur lors de l\'insertion:', err);
            } else {
              console.log('Données insérées avec succès');
            }
          });
        });

        res.send({ message: 'Fichier téléchargé et données insérées avec succès' });
      },
    });
  });
});

app.listen(5000, () => {
  console.log('Serveur backend en cours d\'exécution sur le port 5000');
});
