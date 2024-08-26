const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/authController');
const tokenMiddleware = require('../middleware/tokenMiddleware');

const router = express.Router();

router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Invalid email format'),
    body('full_name')
      .isLength({ min: 4 })
      .withMessage('Full name must be at least 4 characters long'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long'),
  ],
  authController.register
);

router.post(
  '/login',
  [
    body('emailOrUsername')
      .notEmpty()
      .withMessage('Email or username is invalid'),
    body('password').notEmpty(),
  ],
  authController.login
);

router.post(
  '/verify-otp',
  tokenMiddleware,
  [body('otp').isLength({ min: 6, max: 6 })],
  authController.verifyOTP
);

router.post('/resend-otp', tokenMiddleware, authController.resendOTP);

router.post('/social-auth', authController.socialAuth);

module.exports = router;
