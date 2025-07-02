const express = require('express');
const router = express.Router();
const pool = require('../database/db');

// GET all events
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, title, date_full, day, month, location, description, image, is_completed, link
      FROM events
      ORDER BY date_full
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 