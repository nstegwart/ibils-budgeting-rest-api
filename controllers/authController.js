const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const User = require('../models/user');
const OTP = require('../models/otp');
const PremiumStatus = require('../models/premium-status');

const nodemailer = require('nodemailer');

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
    const errors = {};
    const existingUsername = await User.findOne({
      where: { username: req.body.username },
    });

    const existingEmail = await User.findOne({
      where: { email: req.body.email },
    });

    if (existingUsername) {
      errors.username = 'Username already in use';
    }

    if (existingEmail) {
      errors.email = 'Email already in use';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ data: errors });
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

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
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

    res.status(201).json({
      message: 'User registered successfully. Please check your email for OTP.',
      userId: user.id,
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

    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: emailOrUsername }, { username: emailOrUsername }],
      },
    });

    console.log('User:', user);

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
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, userId: user.id });
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

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error verifying OTP', error: error.message });
  }
};

exports.resendOTP = async (req, res) => {
  try {
    const userId = req.userData.userId; // Extract userId from token

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    // Update or create new OTP record
    await OTP.upsert({
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

exports.getProfile = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const user = await User.findByPk(userId, {
      attributes: [
        'id',
        'username',
        'email',
        'full_name',
        'phone_number',
        'avatar_url',
        'user_language',
        'profile_picture',
      ],
      include: [
        {
          model: PremiumStatus,
          attributes: [
            'premium_status',
            'packageId',
            'expiration_date',
            'createdAt',
            'updatedAt',
          ],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userProfile = user.toJSON();
    userProfile.premium_status = userProfile.PremiumStatus || null;
    delete userProfile.PremiumStatus;

    res.status(200).json({ user: userProfile });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching profile', error: error.message });
  }
};
