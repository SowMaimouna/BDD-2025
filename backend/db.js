const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000, // Timeout de connexion 10 sec
    enableKeepAlive: true, // ✅ Garde les connexions actives
    keepAliveInitialDelay: 10000, // Délai avant de rafraîchir la connexion
});

// Vérification de la connexion
db.getConnection((err, connection) => {
    if (err) {
        console.error('Erreur de connexion à la base de données:', err);
        return;
    }
    console.log('Connexion à la base de données réussie');
    connection.release();
});
// 🔹 Gérer les erreurs de connexion
db.on("error", (err) => {
    console.error("❌ Problème avec la base de données :", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
        console.log("🔄 Tentative de reconnexion...");
    }
});

module.exports = db;
