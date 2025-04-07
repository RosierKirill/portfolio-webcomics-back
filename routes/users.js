const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
require('dotenv').config();

const User = {
  findByEmail: async (email) => {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  create: async (username, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    return result.insertId;
  }
};

// Liste des utilisateurs (sans mot de passe)
router.get('/', async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, username, email FROM users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

// Enregistrement
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userId = await User.create(username, email, password);
    res.status(201).json({ message: 'Utilisateur créé', userId });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

// Connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'Identifiants incorrects (utilisateur)' });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: 'Identifiants incorrects (mot de passe)' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

module.exports = router;
