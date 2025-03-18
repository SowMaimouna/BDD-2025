const express = require('express');
const router = express.Router();
const db = require('./db');  // Importation depuis db.js
const nodemailer = require('nodemailer');
const multer = require("multer");
const path = require("path");
// Configuration de multer pour stocker les fichiers dans 'uploads/'
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Nom unique pour chaque fichier
    },
});
const upload = multer({ storage });
const generateOTP = require('./utils/generateOTP');
require('dotenv').config();  // Charger les variables d'environnement

// Ajouter un candidat
router.post("/candidat", upload.single("photo"), (req, res) => {
    const { numero_carte_electeur, email, telephone, parti, slogan, couleur1, couleur2, couleur3, url} = req.body;
    const photo = req.file ? req.file.filename : null; // Récupérer le nom du fichier

    if (!numero_carte_electeur || !email || !telephone) {
        return res.status(400).json({ error: "Les champs numCarteElecteur, email et telephone sont obligatoires" });
    }

    const query = "INSERT INTO candidat (numero_carte_electeur, email, telephone, parti, slogan, couleur1, couleur2, couleur3, url, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    db.getConnection((err, connection) => {
        if (err) {
            console.error("Erreur de connexion au pool :", err);
            return res.status(500).json({ error: "Erreur lors de la récupération de la connexion" });
        }

        connection.query(
            query,
            [numero_carte_electeur, email, telephone, parti, slogan, couleur1, couleur2, couleur3, url, photo],
            (err, result) => {
                connection.release();

                if (err) {
                    console.error("Erreur lors de l'ajout du candidat:", err);
                    return res.status(500).json({ error: "Erreur lors de l'ajout du candidat" });
                }

                res.status(201).json({ message: "Candidat ajouté avec succès", id: result.insertId });
            }
        );
    });
});

// Récupérer la liste des candidats
router.get('/candidat', (req, res) => {
    const query = 'SELECT * FROM candidat';

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
router.get('/candidat/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM candidat WHERE id = ?';

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Erreur de connexion à la base:', err);
            return res.status(500).json({ error: 'Erreur de connexion à la base de données' });
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

            res.json(results[0]); // Retourne le premier candidat trouvé
        });
    });
});

// Route de vérification de l'électeur par numéro de carte
router.get('/electeurs/check', (req, res) => {
    const num = req.query.num; // Récupère le numéro de carte depuis la query string

    if (!num) {
        return res.status(400).json({ error: "Le numéro de carte est requis." });
    }

    const query = 'SELECT numero_carte_electeur, nom, prenom, date_naissance FROM electeurs WHERE numero_carte_electeur = ?';

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
                nom: electeur.nom,
                prenom: electeur.prenom,
                date_naissance: electeur.date_naissance,
            });
        });
    });
});


router.post('/candidat/send-otp', async (req, res) => {
    const { email } = req.body;
    console.log("Requête reçue pour envoyer OTP à :", email);

    if (!email) {
        console.log("Erreur : email non fourni");
        return res.status(400).json({ error: "Email requis." });
    }

    const otp = generateOTP();
    console.log("OTP généré :", otp);

    const updateQuery = 'UPDATE candidat SET otp_code = ? WHERE email = ?';
    db.query(updateQuery, [otp, email], async (err) => {
        if (err) {
            console.error("Erreur lors de l'enregistrement de l'OTP :", err);
            return res.status(500).json({ error: "Erreur lors de l'enregistrement de l'OTP." });
        }

        console.log("OTP enregistré en DB pour", email);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Votre code OTP",
            text: `Votre code OTP est : ${otp}`
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log("Email OTP envoyé avec succès !");
            res.json({ message: "OTP envoyé avec succès !" });
        } catch (error) {
            console.error("Erreur lors de l'envoi de l'email :", error);
            res.status(500).json({ error: "Impossible d'envoyer l'OTP." });
        }
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



module.exports = router;
