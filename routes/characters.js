const express = require('express');
const router = express.Router();
const Character = require('../models/character');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const characters = await Character.findAll();
    res.json(characters);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const character = await Character.findById(req.params.id);
    if (!character) return res.status(404).json({ message: 'Personnage non trouvé' });
    res.json(character);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

router.post('/', auth, async (req, res) => {
  const { name, generalInfo, description, history, imageUrl, model3dUrl } = req.body;
  try {
    const characterId = await Character.create(name, generalInfo, description, history, imageUrl, model3dUrl, req.user.id);
    res.status(201).json({ message: 'Personnage créé', characterId });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

router.put('/:id', auth, async (req, res) => {
  const { name, generalInfo, description, history, imageUrl, model3dUrl } = req.body;
  try {
    await Character.update(req.params.id, name, generalInfo, description, history, imageUrl, model3dUrl, req.user.id);
    res.json({ message: 'Personnage mis à jour' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Character.delete(req.params.id);
    res.json({ message: 'Personnage supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

module.exports = router;