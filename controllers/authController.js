const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const User = require('../models/user');
const OTP = require('../models/otp');

const nodemailer = require('nodemailer');
const Wallet = require('../models/wallet');
const { validationResult } = require('express-validator');
const PremiumStatus = require('../models/premium-status');
const { getUserProfile } = require('./userController');
const { formatArrayError } = require('../utils/objectHandler');

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true,
    auth: {
      user: process.env.NODEMAIL_EMAIL,
      pass: process.env.NODEMAIL_PASSWORD,
    },
  });

  const mailSend = await transporter.sendMail({
    from: process.env.NODEMAIL_EMAIL,
    to,
    subject,
    text,
  });
  return mailSend;
};

exports.register = async (req, res) => {
  try {
    const { username, email, full_name, phone_number, password } = req.body;
    const errors = validationResult(req);
    const fieldError = {};
    // const existingUsername = await User.findOne({
    //   where: { username: req.body.username },
    // });

    const existingEmail = await User.findOne({
      where: { email: req.body.email },
    });

    // if (existingUsername) {
    //   fieldError.username = 'Username already in use';
    // }

    if (existingEmail) {
      fieldError.email = 'Email already in use';
    }
    if (!errors.isEmpty() || Object.keys(fieldError).length > 0) {
      const formattedErrors = formatArrayError(errors.array());

      return res
        .status(400)
        .json({ error: { ...formattedErrors, ...fieldError } });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      username,
      email,
      full_name,
      phone_number,
      password: hashedPassword,
      register_via: 'internal',
    });
    await Wallet.create({
      wallet_name: 'Personal Wallet',
      userId: user.id,
      wallet_icon: '1', // You can set a default icon or leave it null
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '90d' }
    );

    // Generate and send OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    await OTP.create({
      userId: user.id,
      otp,
      expires_at: expiresAt,
    });

    // Send OTP via email
    await sendEmail(
      user.email,
      'Welcome to Our Service - Verify Your Account',
      `Welcome ${full_name}! Your OTP for account verification is: ${otp}`
    );

    const userProfile = await getUserProfile(user.id);

    res.status(201).json({
      message: 'User registered successfully. Please check your email for OTP.',
      data: userProfile,
      token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error registering user', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = formatArrayError(errors.array());
      console.log('login errors', errors.array(), errors);
      return res.status(400).json({ error: formattedErrors });
    }

    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: emailOrUsername }, { username: emailOrUsername }],
      },
    });

    if (!user) {
      return res.status(401).json({
        message: 'Account not registered',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: 'Invalid username/email or password' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '90d' }
    );

    const userProfile = await getUserProfile(user.id);
    res.status(200).json({ token, data: userProfile });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const userId = req.userData.userId; // Extract userId from token

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otpRecord = await OTP.findOne({
      where: {
        userId: userId,
        otp,
        expires_at: { [Op.gt]: new Date() },
      },
    });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    await User.update({ is_verified: true }, { where: { id: userId } });
    await OTP.destroy({ where: { id: otpRecord.id } });

    const userProfile = await getUserProfile(userId);
    res
      .status(200)
      .json({ message: 'OTP verified successfully', data: userProfile });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error verifying OTP', error: error.message });
  }
};

exports.resendOTP = async (req, res) => {
  try {
    const userId = req.userData.userId;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete existing OTP for this user
    await OTP.destroy({ where: { userId: userId } });

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    // Create new OTP record
    await OTP.create({
      userId: userId,
      otp,
      expires_at: expiresAt,
    });

    // Send new OTP via email
    await sendEmail(
      user.email,
      'Your New OTP for Account Verification',
      `Your new OTP is: ${otp}`
    );

    res.status(200).json({ message: 'New OTP sent successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error resending OTP', error: error.message });
  }
};

exports.socialAuth = async (req, res) => {
  try {
    const { email, register_via } = req.body;

    if (!['fb', 'google', 'apple'].includes(register_via)) {
      return res.status(400).json({ message: 'Invalid social media platform' });
    }

    let user = await User.findOne({ where: { email } });

    if (user) {
      // User exists, perform login
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '90d' }
      );

      const userProfile = await getUserProfile(user.id);
      return res.status(200).json({ token, data: userProfile });
    } else {
      // User doesn't exist, perform registration
      user = await User.create({
        email,
        register_via,
        is_verified: true, // Social media users are considered verified
      });

      await Wallet.create({
        wallet_name: 'Personal Wallet',
        userId: user.id,
        wallet_icon: '1',
      });

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '90d' }
      );

      const userProfile = await getUserProfile(user.id);

      return res.status(201).json({
        message: 'User registered successfully via social media.',
        data: userProfile,
        token,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error in social authentication',
      error: error.message,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // Token expires in 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    const resetURL = `${process.env.BASE_URL}/forgot-password?token=${resetToken}`;

    await sendEmail(
      user.email,
      'Password Reset Request',
      `You requested a password reset. Please click on the following link to reset your password: ${resetURL}`
    );

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({
      message: 'Error in forgot password process',
      error: error.message,
    });
  }
};

exports.verifyForgotPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 8 characters long' });
    }

    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: 'Invalid or expired password reset token' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error in password reset process',
      error: error.message,
    });
  }
};
