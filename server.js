// Import des modules
const express = require('express');
const cors = require('cors');
const multer = require('multer');  // Si vous voulez gérer l'upload de fichiers
const path = require('path');

// Initialisation d'Express
const app = express();

// Activation de CORS pour accepter les requêtes venant de localhost:3000
app.use(cors());

// Configuration de multer pour gérer les uploads de fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Le répertoire où vous voulez stocker les fichiers
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nom unique pour le fichier
  }
});

const upload = multer({ storage: storage });

// Route pour l'upload du fichier
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file || !req.body.checksum) {
    return res.status(400).send({ error: 'Fichier et empreinte SHA-256 requis.' });
  }

  // Vous pouvez ici valider l'empreinte SHA-256 si nécessaire
  // Exemple : Calculer et comparer l'empreinte du fichier téléchargé

  console.log('Fichier reçu :', req.file);
  console.log('Empreinte SHA-256 :', req.body.checksum);

  // Réponse après l'upload
  res.send({ message: 'Fichier téléchargé avec succès', file: req.file });
});

// Démarrage du serveur
app.listen(5000, () => {
  console.log('Serveur backend en cours d\'exécution sur le port 5000');
});
