require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

console.log('Testing DB connection with:', {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD ? '***' : undefined
});

async function testDB() {
  try {
    // Test connection
    const nowRes = await pool.query('SELECT NOW()');
    console.log('Connection successful! Time:', nowRes.rows[0]);

    // Test books table
    const booksRes = await pool.query('SELECT * FROM books LIMIT 1');
    console.log('Books table sample:', booksRes.rows);

    // Test events table
    const eventsRes = await pool.query('SELECT * FROM events LIMIT 1');
    console.log('Events table sample:', eventsRes.rows);
  } catch (err) {
    console.error('Database error:', err);
  } finally {
    await pool.end();
  }
}

testDB(); 