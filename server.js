require('dotenv').config();

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const sequelize = require('./utils/database');

const authRoutes = require('./routes');
const { seedCategories, seedCategoryIcons } = require('./utils/dummy');

const PremiumStatus = require('./models/premium-status');
const User = require('./models/user');
const Package = require('./models/package');
const OTP = require('./models/otp');

const Wallet = require('./models/wallet');
const MonthlyBudgeting = require('./models/monthly-budget');
const Category = require('./models/category');
const CategoryIcon = require('./models/category-icon');
const DailyExpense = require('./models/daily-expense');
const Currency = require('./models/currency');
const { seedCurrencies, seedPackages } = require('./utils/initialData');

User.hasMany(PremiumStatus, { foreignKey: 'userId' });
User.belongsTo(Currency, {
  foreignKey: 'preferredCurrencyId',
  as: 'preferredCurrency',
});
Currency.hasMany(User, { foreignKey: 'preferredCurrencyId' });

PremiumStatus.belongsTo(User, { foreignKey: 'userId' });
Package.hasMany(PremiumStatus, { foreignKey: 'packageId' });
PremiumStatus.belongsTo(Package, { foreignKey: 'packageId' });

User.hasOne(OTP, { foreignKey: 'userId' });
OTP.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Wallet, { foreignKey: 'userId' });
Wallet.belongsTo(User, { foreignKey: 'userId' });
Wallet.hasMany(MonthlyBudgeting, { foreignKey: 'walletId' });
MonthlyBudgeting.belongsTo(Wallet, { foreignKey: 'walletId' });
Wallet.belongsTo(CategoryIcon, { foreignKey: 'wallet_icon', as: 'icon' });
CategoryIcon.hasMany(Wallet, { foreignKey: 'wallet_icon' });

Category.hasMany(MonthlyBudgeting, { foreignKey: 'categoryId' });
MonthlyBudgeting.belongsTo(Category, { foreignKey: 'categoryId' });

User.hasMany(Category, { foreignKey: 'userId' });
Category.belongsTo(User, { foreignKey: 'userId', as: 'creator' });

Category.belongsTo(CategoryIcon, { foreignKey: 'category_icon', as: 'icon' });
CategoryIcon.hasMany(Category, { foreignKey: 'category_icon' });

Wallet.hasMany(DailyExpense, { foreignKey: 'walletId' });
DailyExpense.belongsTo(Wallet, { foreignKey: 'walletId' });

Category.hasMany(DailyExpense, { foreignKey: 'categoryId' });
DailyExpense.belongsTo(Category, { foreignKey: 'categoryId' });

const port = process.env.PORT;
const app = express();

// for parsing application/json & application/xwww-
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use((error, req, res, next) => {
  console.log(`Error express: `, error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

app.use(
  '/public/images',
  express.static(path.join(__dirname, 'public/images'))
);
app.get('/', (req, res) => {
  res
    .status(200)
    .send('<html><body><h1>Success! The API is running.</h1></body></html>');
});

// APPI ROUTES
app.use('/api/v1', authRoutes);

// Start server
sequelize
  // .sync({ force: true, alter: true })
  .sync({ alter: true })
  .then(async () => {
    console.log('Database & tables created!');
    await seedPackages();
    await seedCategoryIcons();
    await seedCategories();
    await seedCurrencies();
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => console.log('Connection database failed: ', err));
