const express = require('express');

const userController = require('../controllers/userController');
const tokenMiddleware = require('../middleware/tokenMiddleware');

const router = express.Router();

router.get('/profile', tokenMiddleware, userController.getProfile);

module.exports = router;
