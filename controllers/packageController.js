const Package = require('../models/package');
const PremiumStatus = require('../models/premium-status');
const User = require('../models/user');
const { getUserProfile } = require('./userController');

exports.getAllPackages = async (req, res, next) => {
  try {
    const packages = await Package.findAll();
    res.status(200).json({
      message: 'Packages fetched successfully',
      packages: packages,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.purchasePremium = async (req, res, next) => {
  try {
    const { packageId, purchase_from } = req.body;
    const userId = req.userData.userId;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const package = await Package.findByPk(packageId);
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

    const currentPremiumStatus = await PremiumStatus.findOne({
      where: { userId: user.id },
      order: [['createdAt', 'DESC']],
    });

    let expirationDate;
    if (currentPremiumStatus && currentPremiumStatus.expiration_date) {
      expirationDate = new Date(currentPremiumStatus.expiration_date);
    } else {
      expirationDate = new Date();
    }

    expirationDate.setDate(expirationDate.getDate() + package.days_duration);

    await PremiumStatus.create({
      userId: user.id,
      packageId: package.id,
      premium_status: true,
      expiration_date: expirationDate,
      purchase_from,
    });

    const userProfile = await getUserProfile(userId);

    res.status(201).json({
      message: 'Premium package purchased successfully',
      data: userProfile,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getUserPremiumStatus = async (req, res, next) => {
  try {
    const userId = req.userData.userId;

    const premiumStatus = await PremiumStatus.findOne({
      where: { userId: userId },
      include: [
        {
          model: Package,
          attributes: ['name_package', 'price', 'days_duration'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    if (!premiumStatus) {
      return res.status(200).json({
        message: 'User has no premium status',
        data: null,
      });
    }

    const formattedStatus = {
      premium_status: premiumStatus.premium_status,
      packageId: premiumStatus.packageId,
      package: premiumStatus.Package,
      expiration_date: premiumStatus.expiration_date,
      createdAt: premiumStatus.createdAt,
      updatedAt: premiumStatus.updatedAt,
      purchase_from: premiumStatus.purchase_from,
    };

    res.status(200).json({
      message: 'User premium status fetched successfully',
      data: formattedStatus,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getUserPremiumHistory = async (req, res, next) => {
  try {
    const userId = req.userData.userId;

    const premiumHistory = await PremiumStatus.findAll({
      where: { userId: userId },
      include: [
        {
          model: Package,
          attributes: ['name_package', 'price', 'days_duration'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    if (premiumHistory.length === 0) {
      return res.status(200).json({
        message: 'User has no premium purchase history',
        data: [],
      });
    }

    const formattedHistory = premiumHistory.map((status) => ({
      premium_status: status.premium_status,
      packageId: status.packageId,
      package: status.Package,
      expiration_date: status.expiration_date,
      createdAt: status.createdAt,
      updatedAt: status.updatedAt,
      purchase_from: status.purchase_from,
    }));

    res.status(200).json({
      message: 'User premium purchase history fetched successfully',
      data: formattedHistory,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
