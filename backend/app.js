const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorMiddleware = require('./middlewares/error');

const app = express();

app.use(express.json());
app.use(cookieParser());

console.log('CLIENT_URL:', process.env.CLIENT_URL);

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));



// Routes
app.use('/api', require('./routes/authRoutes'));
app.use('/api/leads', require('./routes/leadRoutes'));

// Error middleware (must be after all routes)
app.use(errorMiddleware);

module.exports = app;
