const Package = require('../models/package');
const PremiumStatus = require('../models/premium-status');
const User = require('../models/user');

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
    const { packageId } = req.body;
    const userId = req.userData.userId; // Extract userId from token

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const package = await Package.findByPk(packageId);
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + package.days_duration);

    const premiumStatus = await PremiumStatus.create({
      userId: user.id,
      packageId: package.id,
      premium_status: true,
      expiration_date: expirationDate,
    });

    res.status(201).json({
      message: 'Premium package purchased successfully',
      premiumStatus: premiumStatus,
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
    const userId = req.userData.userId; // Assuming you're using tokenMiddleware

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
      return res
        .status(404)
        .json({ message: 'Premium status not found for this user' });
    }

    res.status(200).json({
      message: 'User premium status fetched successfully',
      premiumStatus: {
        status: premiumStatus.premium_status,
        expirationDate: premiumStatus.expiration_date,
        package: premiumStatus.Package,
      },
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
