const express = require('express');
const app = express();
const cors = require('cors'); 
require('dotenv').config();

const characterRoutes = require('./routes/characters');
const userRoutes = require('./routes/users');

app.use(cors()); 
app.use(express.json());

app.use('/api/characters', characterRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});