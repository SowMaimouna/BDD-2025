require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const nodemailer = require("nodemailer");


const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  // host: "localhost",
  // user: "root",
  // password: "",
  // database: "parrainage",
  // port: 3307,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
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

  const query = `SELECT nom, prenom, DATE_FORMAT(date_naissance, '%Y-%m-%d') AS date_naissance, bureau_vote FROM electeurs WHERE numero_carte_electeur = ? AND numero_carte_identite = ?`;

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

app.post("/parrainage", async (req, res) => {
  const { numElecteur } = req.body;

  if (!numElecteur) {
    return res.status(400).json({ error: "Le numéro d'électeur est requis." });
  }

  try {
    console.log("Numéro d'électeur reçu :", numElecteur);

    // 🔹 Vérification que l'électeur existe
    const [electeur] = await db.query("SELECT email FROM electeurs WHERE numero_carte_electeur = ?", [numElecteur]);

    if (!electeur || !electeur.email) {
      console.error("Électeur non trouvé dans la base de données.");
      return res.status(404).json({ error: `Électeur avec numéro ${numElecteur} non trouvé.` });
    }

    const email = electeur.email;
    console.log(`Email trouvé pour ${numElecteur} : ${email}`);

    // 🔹 Génération du code OTP (5 chiffres)
    const codeOTP = Math.floor(10000 + Math.random() * 90000);
    console.log(`Code OTP généré: ${codeOTP}`);

    // 🔹 Envoi de l'email avec l'OTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Code de vérification",
      text: `Votre code de vérification est : ${codeOTP}.`,
    };

    await transporter.sendMail(mailOptions);
    console.log(" Email envoyé avec succès !");

    // 🔹 Stocker l'OTP dans la base de données avec une expiration , code_expiration = NOW() + INTERVAL 5 MINUTE   AND code_expiration > NOW()
    await db.query("UPDATE electeurs SET code_authentification = ? WHERE numero_carte_electeur = ?", 
      [codeOTP, numElecteur]
    );

    return res.json({ success: true, message: "Code envoyé avec succès." });

  } catch (error) {
    console.error(" Erreur lors de l'envoi de l'OTP :", error.message);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
});


app.post("/verify-parrainage", (req, res) => {
  const { numElecteur, candidatId, code } = req.body;
  console.log("🔍 Requête reçue pour vérification :", req.body);

  if (!numElecteur || !candidatId || !code) {
    console.log("❌ Données manquantes !");
    return res.status(400).json({ error: "Données manquantes" });
  }

  // 🔹 Vérifier si l'OTP est correct
  db.query(
    "SELECT id, email FROM electeurs WHERE numero_carte_electeur = ? AND code_parrainage = ?",
    [numElecteur, code],
    (err, result) => {
      if (err) {
        console.error("❌ Erreur lors de la vérification de l'OTP :", err.message);
        return res.status(500).json({ error: "Erreur serveur" });
      }

      if (!result.length) {
        console.log("❌ Code OTP incorrect.");
        return res.status(400).json({ error: "Code OTP incorrect." });
      }

      const electeur = result[0];
      console.log("✅ Électeur trouvé :", electeur);

      // 🔹 Vérifier si le candidat existe
      db.query("SELECT id FROM candidat WHERE id = ?", [candidatId], (candidatErr, candidatResult) => {
        if (candidatErr) {
          console.error("❌ Erreur lors de la vérification du candidat :", candidatErr.message);
          return res.status(500).json({ error: "Erreur serveur" });
        }

        if (!candidatResult.length) {
          console.log("❌ Candidat inexistant !");
          return res.status(400).json({ error: "Candidat inexistant." });
        }

        // 🔹 Vérifier si l'électeur a déjà parrainé quelqu'un
        db.query("SELECT id FROM parrainage_valide WHERE electeur_id = ?", [electeur.id], (checkErr, checkResult) => {
          if (checkErr) {
            console.error("❌ Erreur lors de la vérification du parrainage :", checkErr.message);
            return res.status(500).json({ error: "Erreur serveur" });
          }

          if (checkResult.length) {
            console.log("❌ L'électeur a déjà parrainé un candidat !");
            return res.status(400).json({ error: "Vous avez déjà parrainé un candidat." });
          }

          // 🔹 Insérer le parrainage
          db.query(
            "INSERT INTO parrainage_valide (electeur_id, candidat_id) VALUES (?, ?)",
            [electeur.id, candidatId],
            (insertErr) => {
              if (insertErr) {
                console.error("❌ Erreur lors de l'enregistrement du parrainage :", insertErr.message);
                return res.status(500).json({ error: "Erreur serveur" });
              }

              console.log("✅ Parrainage enregistré avec succès pour", numElecteur);

              // ✅ Envoyer une réponse AVANT d'envoyer l'email
              res.json({ success: true, message: "Parrainage validé avec succès !" });

              // 🔹 Envoi de l'email en arrière-plan (sans bloquer la réponse)
              sendConfirmation(electeur.email, candidatId, (emailErr) => {
                if (emailErr) {
                  console.error("❌ Erreur d'envoi de l'email de confirmation :", emailErr.message);
                } else {
                  console.log("📩 Email de confirmation envoyé !");
                }
              });
            }
          );
        });
      });
    }
  );
});


// 🔹 Fonction pour envoyer un email de confirmation
async function sendConfirmation(email, candidatId) {
  const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
      },
  });

  const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Confirmation de votre parrainage",
      text: `Votre parrainage pour le candidat ID: ${candidatId} a bien été enregistré.`,
  };

  try {
      await transporter.sendMail(mailOptions);
      console.log("✅ Email de confirmation envoyé !");
  } catch (error) {
      console.error("❌ Erreur d’envoi de l’email de confirmation :", error.message);
  }
}


app.get("/candidats", (_req, res) => {
  const query = "SELECT id, nom, prenom, slogan, parti, photo FROM candidat";
  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Erreur lors de la récupération des candidats" });
    }
    res.json(result);
  });
});

app.post('/send-otp', (req, res) => {
  console.log("Requête reçue pour envoyer l'OTP :", req.body);

  const { candidatId, numElecteur } = req.body;

  // Vérification des données reçues
  if (!candidatId || !numElecteur) {
      return res.status(400).json({ error: "Données manquantes" });
  }

  // 🔹 Recherche de l'électeur dans la base de données
  db.query(
      "SELECT email FROM electeurs WHERE numero_carte_electeur = ?", 
      [numElecteur], 
      (err, result) => {
          if (err) {
              console.error("Erreur lors de la récupération de l'email :", err);
              return res.status(500).json({ error: "Erreur serveur" });
          }

          if (!result.length) {
              return res.status(404).json({ error: "Électeur non trouvé" });
          }

          const email = result[0].email;
          console.log(`Email trouvé pour ${numElecteur} : ${email}`);

          // 🔹 Génération du code OTP
          const codeOTP = Math.floor(10000 + Math.random() * 90000);
          console.log(`Code OTP généré: ${codeOTP}`);

          // 🔹 Configuration et envoi de l'email
          const transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                  user: process.env.EMAIL_USER,
                  pass: process.env.EMAIL_PASS,
              },
          });

          const mailOptions = {
              from: process.env.EMAIL_USER,
              to: email,
              subject: "Code de vérification",
              text: `Votre code pour le parrainage est : ${codeOTP}`,
          };

          transporter.sendMail(mailOptions, (emailErr, info) => {
              if (emailErr) {
                  console.error("Erreur d’envoi d’email:", emailErr.message);
                  return res.status(500).json({ error: "Échec d’envoi de l’email" });
              }

              console.log("Email envoyé avec succès :", info.response);
              
              // 🔹 Stocker le code OTP dans la table 'electeurs' (colonne 'code_parrainage')
              db.query(
                "UPDATE electeurs SET code_parrainage = ? WHERE numero_carte_electeur = ?", 
                [codeOTP, numElecteur], 
                (updateErr) => {
                    if (updateErr) {
                        console.error("Erreur lors de la mise à jour de l'OTP dans la table electeurs :", updateErr);
                        return res.status(500).json({ error: "Erreur serveur" });
                    }

                      return res.json({ success: true, message: "Code envoyé avec succès." });
                  }
              );
          });
      }
  );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
