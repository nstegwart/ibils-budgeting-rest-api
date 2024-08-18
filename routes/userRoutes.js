const express = require('express');

const authController = require('../controllers/authController');
const tokenMiddleware = require('../middleware/tokenMiddleware');

const router = express.Router();

router.get('/profile', tokenMiddleware, authController.getProfile);

module.exports = router;
