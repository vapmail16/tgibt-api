const express = require('express');
const router = express.Router();
const pool = require('../database/db');

// GET all books with pagination (randomized) and optional category filter
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const offset = (page - 1) * limit;

    let query = `
      SELECT id, title, author, isbn, price, image, description, amazon_link, category, tags, featured
      FROM books
      WHERE tgibt = 'Yes'
    `;
    
    let countQuery = "SELECT COUNT(*) FROM books WHERE tgibt = 'Yes'";
    const queryParams = [];
    const countParams = [];

    // Add category filter if provided
    if (category && category !== 'All') {
      query += " AND category = $1";
      countQuery += " AND category = $1";
      queryParams.push(category);
      countParams.push(category);
    }

    query += " ORDER BY RANDOM() LIMIT $" + (queryParams.length + 1) + " OFFSET $" + (queryParams.length + 2);
    queryParams.push(limit, offset);

    const result = await pool.query(query, queryParams);
    const countResult = await pool.query(countQuery, countParams);
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
      WHERE tgibt = 'Yes'
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
      WHERE tgibt = 'Yes'
      ORDER BY RANDOM()
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    // Get total count for pagination info
    const countResult = await pool.query("SELECT COUNT(*) FROM books WHERE tgibt = 'Yes'");
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

// GET all unique categories
router.get('/categories', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT category 
      FROM books 
      WHERE tgibt = 'Yes' AND category IS NOT NULL AND category != ''
      ORDER BY category
    `);
    
    res.json({
      categories: result.rows.map(row => row.category)
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 