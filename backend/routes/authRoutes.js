const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser
} = require('../controllers/userController');

const { isAuthenticated } = require('../middlewares/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', isAuthenticated, getCurrentUser);

module.exports = router;
