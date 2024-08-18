const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/authController');
const tokenMiddleware = require('../middleware/tokenMiddleware');

const router = express.Router();

router.post(
  '/register',
  [
    body('username').notEmpty(),
    body('email').isEmail(),
    body('full_name').notEmpty(),
    body('phone_number').notEmpty(),
    body('password').isLength({ min: 6 }),
  ],
  authController.register
);

router.post(
  '/login',
  [body('email').isEmail(), body('password').notEmpty()],
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
