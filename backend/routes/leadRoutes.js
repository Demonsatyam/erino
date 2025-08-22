const express = require('express');
const router = express.Router();
const {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead
} = require('../controllers/userController');

const { isAuthenticated } = require('../middlewares/auth');

// All lead routes are protected
router.post('/', isAuthenticated, createLead);
router.get('/', isAuthenticated, getLeads);
router.get('/:id', isAuthenticated, getLeadById);
router.put('/:id', isAuthenticated, updateLead);
router.delete('/:id', isAuthenticated, deleteLead);

module.exports = router;
