const User = require('../models/user');
const PremiumStatus = require('../models/premium-status');

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
