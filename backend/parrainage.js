const express = require('express');
const router = express.Router();
const db = require('./db'); // Assurez-vous que db.js est bien configuré

// Route pour enregistrer un parrainage
router.post('/parrainage', (req, res) => {
    const { electeur_id, candidat_id } = req.body;

    if (!electeur_id || !candidat_id) {
        return res.status(400).json({ error: "electeur_id et candidat_id sont requis." });
    }

    const query = 'INSERT INTO parrainages (electeur_id, candidat_id) VALUES (?, ?)';

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Erreur de connexion au pool:', err);
            return res.status(500).json({ error: 'Erreur de connexion à la base de données.' });
        }
        connection.query(query, [electeur_id, candidat_id], (err, result) => {
            connection.release();
            if (err) {
                console.error("Erreur lors de l'enregistrement du parrainage :", err);
                return res.status(500).json({ error: 'Erreur lors de l\'enregistrement du parrainage.' });
            }
            res.status(201).json({ message: 'Parrainage enregistré avec succès', id: result.insertId });
        });
    });
});

// Exporter les routes
module.exports = router;
