const express = require('express');
const router = express.Router();
const db = require('./db');  // Importation depuis db.js

// Ajouter un candidat
router.post('/candidat', (req, res) => {
    const { numCarteElecteur, email, telephone, parti, slogan, couleur1, couleur2, couleur3, urlInfo } = req.body;

    if (!numCarteElecteur || !email || !telephone) {
        return res.status(400).json({ error: 'Les champs numCarteElecteur, email et telephone sont obligatoires' });
    }

    const query = 'INSERT INTO candidats (numCarteElecteur, email, telephone, parti, slogan, couleur1, couleur2, couleur3, urlInfo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Erreur de connexion au pool :', err);
            return res.status(500).json({ error: 'Erreur lors de la récupération de la connexion' });
        }

        connection.query(query, [numCarteElecteur, email, telephone, parti, slogan, couleur1, couleur2, couleur3, urlInfo], (err, result) => {
            connection.release(); // Libérer la connexion après utilisation

            if (err) {
                console.error('Erreur lors de l\'ajout du candidat:', err);
                return res.status(500).json({ error: 'Erreur lors de l\'ajout du candidat' });
            }

            res.status(201).json({ message: 'Candidat ajouté avec succès', id: result.insertId });
        });
    });
});

// Récupérer la liste des candidats
router.get('/candidats', (req, res) => {
    const query = 'SELECT * FROM candidats';

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Erreur de connexion au pool:', err);
            return res.status(500).json({ error: 'Erreur lors de la récupération de la connexion' });
        }

        connection.query(query, (err, results) => {
            connection.release();

            if (err) {
                console.error('Erreur lors de la récupération des candidats:', err);
                return res.status(500).json({ error: 'Erreur lors de la récupération des candidats' });
            }

            res.json(results);
        });
    });
});

// Récupérer un candidat par son ID
router.get('/candidats/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM candidats WHERE id = ?';

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Erreur de connexion au pool:', err);
            return res.status(500).json({ error: 'Erreur lors de la récupération de la connexion' });
        }

        connection.query(query, [id], (err, results) => {
            connection.release();

            if (err) {
                console.error('Erreur lors de la récupération du candidat:', err);
                return res.status(500).json({ error: 'Erreur lors de la récupération du candidat' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Candidat non trouvé' });
            }

            res.json(results[0]);
        });
    });
});

// Configuration de la période de parrainage
router.post('/parrainage', (req, res) => {
    const { date_debut, date_fin } = req.body;

    // Vérifier que les dates sont fournies
    if (!date_debut || !date_fin) {
        return res.status(400).json({ error: 'Les dates de début et de fin sont obligatoires' });
    }

    const query = 'INSERT INTO parrainage (date_debut, date_fin) VALUES (?, ?)';

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Erreur de connexion au pool:', err);
            return res.status(500).json({ error: 'Erreur lors de la récupération de la connexion' });
        }

        connection.query(query, [date_debut, date_fin], (err, result) => {
            connection.release();

            if (err) {
                console.error('Erreur lors de la configuration du parrainage:', err);
                return res.status(500).json({ error: 'Erreur lors de la configuration du parrainage' });
            }

            res.status(201).json({ message: 'Période de parrainage configurée avec succès', id: result.insertId });
        });
    });
});

// Route de vérification de l'électeur par numéro de carte
router.get('/electeurs/check', (req, res) => {
    const num = req.query.num; // Récupère le numéro de carte depuis la query string

    if (!num) {
        return res.status(400).json({ error: "Le numéro de carte est requis." });
    }

    const query = 'SELECT numCarteElecteur, nom, prenom, date_naissance, registered FROM electeurs WHERE numCarteElecteur = ?';

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Erreur de connexion au pool :', err);
            return res.status(500).json({ error: 'Erreur lors de la connexion à la base de données' });
        }

        connection.query(query, [num], (err, results) => {
            connection.release();

            if (err) {
                console.error('Erreur lors de la requête SQL :', err);
                return res.status(500).json({ error: 'Erreur lors de l\'exécution de la requête' });
            }

            // Si aucun résultat, l'électeur n'existe pas
            if (results.length === 0) {
                return res.json({ exists: false });
            }

            // Si on trouve un résultat
            const electeur = results[0];
            return res.json({
                exists: true,
                registered: electeur.registered === 1, // conversion en booléen
                nom: electeur.nom,
                prenom: electeur.prenom,
                date_naissance: electeur.date_naissance,
            });
        });
    });
});

module.exports = router;
