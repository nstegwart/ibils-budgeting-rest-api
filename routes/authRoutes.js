const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/authController');
const tokenMiddleware = require('../middleware/tokenMiddleware');

const router = express.Router();

router.post(
  '/register',
  [
    body('username')
      .notEmpty()
      .isLength({ min: 4 })
      .withMessage('Username must be at least 4 characters long'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('full_name')
      .notEmpty()
      .isLength({ min: 4 })
      .withMessage('Full name must be at least 4 characters long'),
    body('phone_number')
      .notEmpty()
      .withMessage('Phone number is required')
      .isMobilePhone()
      .isLength({ min: 8, max: 15 })
      .withMessage('Invalid phone number format'),
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

module.exports = router;
