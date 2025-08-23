const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorMiddleware = require('./middlewares/error');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Log origin for debugging
console.log('CLIENT_URL:', process.env.CLIENT_URL);

// CORS setup with dynamic origin check
const allowedOrigins = [process.env.CLIENT_URL];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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

// Error middleware (must be after all routes)
app.use(errorMiddleware);

module.exports = app;
