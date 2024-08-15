require('dotenv').config();

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const sequelize = require('./utils/database');
const { fileFilter, fileStorage } = require('./utils/file-handler');

const authRoutes = require('./routes/authRoutes');

const port = process.env.PORT;
const app = express();

// for parsing application/json & application/xwww-
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image_url')
);
app.use('/images', express.static(path.join(__dirname, 'public/images')));

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
  .sync({ alter: true })
  .then(() => {
    console.log('Database & tables created!');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => console.log('Connection database failed: ', err));
