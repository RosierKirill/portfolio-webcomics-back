const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.getConnection()
  .then(() => console.log('Connexion à la base de données réussie !'))
  .catch(err => {
    console.error('Erreur de connexion à la base de données :', err.message);
    process.exit(1); // stop le serveur si ça coince
  });

module.exports = db;