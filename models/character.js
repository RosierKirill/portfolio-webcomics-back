const db = require('../config/db');

const Character = {
  async findAll() {
    const [rows] = await db.query('SELECT * FROM characters');
    return rows;
  },

  async findById(id) {
    const [rows] = await db.query('SELECT * FROM characters WHERE id = ?', [id]);
    return rows[0];
  },

  async create(name, generalInfo, description, history, imageUrl, model3dUrl, userId) {
    const [result] = await db.query(
      'INSERT INTO characters (name, general_info, description, history, image_url, model3d_url, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, generalInfo, description, history, imageUrl, model3dUrl, userId]
    );
    return result.insertId;
  },

  async update(id, name, generalInfo, description, history, imageUrl, model3dUrl, userId) {
    await db.query(
      'UPDATE characters SET name = ?, general_info = ?, description = ?, history = ?, image_url = ?, model3d_url = ?, last_edited_by = ? WHERE id = ?',
      [name, generalInfo, description, history, imageUrl, model3dUrl, userId, id]
    );
  },

  async delete(id) {
    await db.query('DELETE FROM characters WHERE id = ?', [id]);
  },
};

module.exports = Character;