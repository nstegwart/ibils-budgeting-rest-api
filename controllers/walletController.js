const CategoryIcon = require('../models/category-icon');
const Wallet = require('../models/wallet');

exports.getUserWallets = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const wallets = await Wallet.findAll({
      where: { userId: userId },
      include: [
        {
          model: CategoryIcon,
          as: 'icon',
          attributes: ['name_icon', 'icon_url'],
        },
      ],
    });

    const formattedWallets = wallets.map((wallet) => ({
      id: wallet.id,
      wallet_name: wallet.wallet_name,
      wallet_icon: wallet.icon
        ? {
            name_icon: wallet.icon.name_icon,
            icon_url: wallet.icon.icon_url,
          }
        : null,
      userId: wallet.userId,
    }));

    res.status(200).json({ data: formattedWallets });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching wallets', error: error.message });
  }
};

exports.createWallet = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const { wallet_name, wallet_icon } = req.body;

    const newWallet = await Wallet.create({
      wallet_name,
      wallet_icon,
      userId,
    });

    const walletDetail = await Wallet.findOne({
      where: { id: newWallet.id },
      include: [
        {
          model: CategoryIcon,
          as: 'icon',
          attributes: ['name_icon', 'icon_url'],
        },
      ],
    });

    const formattedWallet = {
      id: walletDetail.id,
      wallet_name: walletDetail.wallet_name,
      wallet_icon: walletDetail.icon
        ? {
            name_icon: walletDetail.icon.name_icon,
            icon_url: walletDetail.icon.icon_url,
          }
        : null,
      userId: walletDetail.userId,
    };

    res
      .status(201)
      .json({ message: 'Wallet created successfully', data: formattedWallet });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error creating wallet', error: error.message });
  }
};

exports.editWallet = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const walletId = req.params.walletId;
    const { wallet_name, wallet_icon } = req.body;

    const wallet = await Wallet.findOne({
      where: { id: walletId, userId: userId },
    });

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    wallet.wallet_name = wallet_name;
    wallet.wallet_icon = wallet_icon;
    await wallet.save();

    const walletDetail = await Wallet.findOne({
      where: { id: walletId, userId: userId },
      include: [
        {
          model: CategoryIcon,
          as: 'icon',
          attributes: ['name_icon', 'icon_url'],
        },
      ],
    });

    const formattedWallet = {
      id: walletDetail.id,
      wallet_name: walletDetail.wallet_name,
      wallet_icon: walletDetail.icon
        ? {
            name_icon: walletDetail.icon.name_icon,
            icon_url: walletDetail.icon.icon_url,
          }
        : null,
      userId: walletDetail.userId,
    };

    res
      .status(200)
      .json({ message: 'Wallet updated successfully', data: formattedWallet });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error updating wallet', error: error.message });
  }
};
