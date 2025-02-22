const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const bodyParser = require('body-parser');

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Importer les routes (une seule fois)
const routes = require('./routes');  // routes.js

// Utiliser les routes
app.use('/api', routes);  // Route principale pour toutes les API

// Démarrer le serveur
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
