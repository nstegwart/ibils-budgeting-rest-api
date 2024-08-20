const fs = require('fs');
const path = require('path');

const User = require('../models/user');
const PremiumStatus = require('../models/premium-status');

exports.getUserProfile = async (userId) => {
  const userData = await User.findByPk(userId, {
    attributes: [
      'id',
      'username',
      'email',
      'full_name',
      'phone_number',
      'user_language',
      'profile_picture',
      'is_verified',
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

  const userProfile = userData.toJSON();
  userProfile.premium_status = userProfile.PremiumStatus || null;
  delete userProfile.PremiumStatus;
  userProfile.profile_picture = `${process.env.BASE_URL}/public/images/${userProfile.profile_picture}`;

  return userProfile;
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const userProfile = await exports.getUserProfile(userId);

    res.status(200).json({ data: userProfile });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching profile', error: error.message });
  }
};

exports.uploadProfilePicture = async (req, res, next) => {
  try {
    const userId = req.userData.userId;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    let user = await User.findByPk(userId, {
      attributes: [
        'id',
        'username',
        'email',
        'full_name',
        'phone_number',
        'user_language',
        'profile_picture',
        'is_verified',
      ],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete old profile picture if exists
    if (user.profile_picture) {
      const oldPath = path.join(
        __dirname,
        '..',
        'public',
        'images',
        user.profile_picture
      );
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Update user with new profile picture
    user.profile_picture = file.filename;
    await user.save();

    const userProfile = await exports.getUserProfile(userId);

    res.status(200).json({
      message: 'Profile picture uploaded successfully',
      data: userProfile,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
