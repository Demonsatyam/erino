const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorMiddleware = require('./middlewares/error');

const app = express();

app.use(express.json());
app.use(cookieParser());

// ✅ Vercel frontend origin (STATIC for now)
app.use(cors({
  origin: 'https://erino-omega.vercel.app',
  credentials: true,
}));

// Optional: log origin per request
app.use((req, res, next) => {
  console.log("Incoming request from origin:", req.headers.origin);
  next();
});

// Routes
app.use('/api', require('./routes/authRoutes'));
app.use('/api/leads', require('./routes/leadRoutes'));

// Error middleware
app.use(errorMiddleware);

module.exports = app;
