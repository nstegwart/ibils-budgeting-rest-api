const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const tokenMiddleware = require('../middleware/tokenMiddleware');

router.get('/public-category', categoryController.getPublicCategories);
router.get(
  '/user-category',
  tokenMiddleware,
  categoryController.getUserCategories
);
router.post(
  '/create-category',
  tokenMiddleware,
  categoryController.createCategory
);
router.put(
  '/edit-category/:id',
  tokenMiddleware,
  categoryController.editCategory
);
router.delete(
  '/delete-category/:id',
  tokenMiddleware,
  categoryController.deleteCategory
);

router.get('/category-icons', categoryController.getCategoryIcons);

module.exports = router;
