const express = require('express');
const router = express.Router();
const pool = require('../database/db');

// GET all books
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, title, author, isbn, price, image, description, amazon_link, category, tags, featured
      FROM books
      ORDER BY id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 