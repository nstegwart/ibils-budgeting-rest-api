const express = require('express');
const multer = require('multer');

const userController = require('../controllers/userController');
const tokenMiddleware = require('../middleware/tokenMiddleware');

const { fileStorage, fileFilter } = require('../utils/file-handler');
const upload = multer({ storage: fileStorage, fileFilter: fileFilter });

const router = express.Router();

router.get('/profile', tokenMiddleware, userController.getProfile);

router.post(
  '/upload-profile-picture',
  tokenMiddleware,
  upload.single('profile_picture'),
  userController.uploadProfilePicture
);

module.exports = router;
