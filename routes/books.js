const express = require('express');
const router = express.Router();
const pool = require('../database/db');

// GET all books with pagination (randomized)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const result = await pool.query(`
      SELECT id, title, author, isbn, price, image, description, amazon_link, category, tags, featured
      FROM books
      ORDER BY RANDOM()
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    // Get total count for pagination info
    const countResult = await pool.query('SELECT COUNT(*) FROM books');
    const totalBooks = parseInt(countResult.rows[0].count);

    res.json({
      books: result.rows,
      pagination: {
        page,
        limit,
        total: totalBooks,
        totalPages: Math.ceil(totalBooks / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET random books (limited to 4)
router.get('/featured', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, title, author, isbn, price, image, description, amazon_link, category, tags, featured
      FROM books
      ORDER BY RANDOM()
      LIMIT 4
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching random books:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET random books with pagination
router.get('/random', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const offset = (page - 1) * limit;

    const result = await pool.query(`
      SELECT id, title, author, isbn, price, image, description, amazon_link, category, tags, featured
      FROM books
      ORDER BY RANDOM()
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    // Get total count for pagination info
    const countResult = await pool.query('SELECT COUNT(*) FROM books');
    const totalBooks = parseInt(countResult.rows[0].count);

    res.json({
      books: result.rows,
      pagination: {
        page,
        limit,
        total: totalBooks,
        totalPages: Math.ceil(totalBooks / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching random books:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 