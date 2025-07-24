console.log('Loaded DB config:', {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  name: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT
});

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const booksRouter = require('./routes/books');
const eventsRouter = require('./routes/events');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/books', booksRouter);
app.use('/api/events', eventsRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'TGIBT API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
