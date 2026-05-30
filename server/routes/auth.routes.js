const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { registerValidation, loginValidation } = require('../validators/auth.validators');

/**
 * Auth Routes
 * Handles user authentication and profile management
 */

// Register new user
router.post('/register', registerValidation, validate, register);

// Login user
router.post('/login', loginValidation, validate, login);

// Get current user profile (Protected)
router.get('/me', authenticateToken, getMe);

module.exports = router;