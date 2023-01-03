const express = require('express');
const path = require('path');

// Importation de mongoose
const mongoose = require('./mongo-connect');

// Création de l'app Express
const app = express();

// Import des routes
const sauceRoutes = require('./routes/sauce.routes');
const userRoutes = require('./routes/user.routes');

// Headers pour contourner les erreurs de CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Conversion de la requête
app.use(express.json());

// Routes de l'API
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;