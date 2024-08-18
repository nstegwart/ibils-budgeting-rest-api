const Wallet = require('../models/wallet');

exports.getUserWallets = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const wallets = await Wallet.findAll({ where: { userId: userId } });
    res.status(200).json({ data: wallets });
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

    res
      .status(201)
      .json({ message: 'Wallet created successfully', wallet: newWallet });
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

    res
      .status(200)
      .json({ message: 'Wallet updated successfully', wallet: wallet });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error updating wallet', error: error.message });
  }
};
