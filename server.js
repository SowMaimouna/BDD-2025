const express = require("express");
const cors = require("cors");
const db = require("./db"); // Importation de la configuration de la base de données

const app = express();
const PORT = 5000;

// Middleware pour parser les requêtes JSON et autoriser les requêtes CORS
app.use(cors());
app.use(express.json());

// Endpoint pour enregistrer les dates de début et de fin
app.post("/api/parrainage-period", (req, res) => {
  const { startDate, endDate } = req.body;

  // Validation des dates côté serveur
  const today = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Vérifier que la date de début est avant la date de fin
  if (start >= end) {
    return res.status(400).json({ error: "La date de début doit être avant la date de fin." });
  }

  // Vérifier que la date de début est au moins 6 mois après la date actuelle
  const sixMonthsLater = new Date(today);
  sixMonthsLater.setMonth(today.getMonth() + 6);

  if (start < sixMonthsLater) {
    return res.status(400).json({ error: "La date de début doit être au moins 6 mois après la date actuelle." });
  }

  // Insertion des dates dans la base de données
  const query = "INSERT INTO parrainage_period (start_date, end_date) VALUES (?, ?)";
  db.query(query, [startDate, endDate], (err, result) => {
    if (err) {
      console.error("Erreur lors de l'enregistrement des dates :", err);
      return res.status(500).json({ error: "Erreur lors de l'enregistrement des dates." });
    }
    res.status(201).json({ message: "Dates enregistrées avec succès.", id: result.insertId });
  });
});

// Endpoint pour récupérer les dates actuelles de la période de parrainage
app.get("/api/parrainage-period", (req, res) => {
  const query = "SELECT * FROM parrainage_period ORDER BY created_at DESC LIMIT 1";
  db.query(query, (err, result) => {
    if (err) {
      console.error("Erreur lors de la récupération des dates :", err);
      return res.status(500).json({ error: "Erreur lors de la récupération des dates." });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "Aucune période de parrainage enregistrée." });
    }
    res.status(200).json(result[0]);
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur backend en cours d'exécution sur http://localhost:${PORT}`);
});