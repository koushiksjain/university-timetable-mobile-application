const express = require('express');
const router = express.Router();

const login = require('../controllers/auth/login.controller');
const register = require('../controllers/auth/register.controller');
const forgotPassword = require('../controllers/auth/forgotPassword.controller');
const authService = require('../services/auth.service');

// Public routes
router.post('/login', login);
router.post('/register', register);
router.post('/forgot-password', forgotPassword);

// Token refresh
router.post('/refresh', authService.refreshToken);

// Protected routes
router.post('/logout', authService.logout);

module.exports = router;