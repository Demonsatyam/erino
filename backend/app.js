const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

// Routes will be added here later
app.get('/', (req, res) => {
  res.send('API is running...');
});

module.exports = app;
