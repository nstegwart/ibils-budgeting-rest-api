const express = require('express');
const authRoutes = require('./authRoutes');
const packageRoutes = require('./packageRoutes');
const userRoutes = require('./userRoutes');
const walletRoutes = require('./walletRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/packages', packageRoutes);
router.use('/user', userRoutes);
router.use('/wallet', walletRoutes);

module.exports = router;
