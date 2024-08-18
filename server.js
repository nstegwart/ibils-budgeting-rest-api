require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const sequelize = require('./utils/database');

const PremiumStatus = require('./models/premium-status');
const User = require('./models/user');
const Package = require('./models/package');
const OTP = require('./models/otp');
const seedPackages = require('./utils/dummy');

const authRoutes = require('./routes');

User.hasOne(PremiumStatus, { foreignKey: 'userId' });
PremiumStatus.belongsTo(User, { foreignKey: 'userId' });

Package.hasMany(PremiumStatus, { foreignKey: 'packageId' });
PremiumStatus.belongsTo(Package, { foreignKey: 'packageId' });
OTP.belongsTo(User, { foreignKey: 'userId' });

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
  .sync()
  .then(async () => {
    // User.drop();
    // OTP.drop();
    console.log('Database & tables created!');
    await seedPackages();
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => console.log('Connection database failed: ', err));
