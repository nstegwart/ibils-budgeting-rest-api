const Category = require('../models/category');
const CategoryIcon = require('../models/category-icon');

const seedCategoryIcons = async () => {
  const icons = Array.from({ length: 30 }, (_, i) => ({
    name_icon: `Icon ${i + 1}`,
    icon_url: `https://example.com/icon${i + 1}.png`,
  }));

  for (const icon of icons) {
    await CategoryIcon.findOrCreate({
      where: { name_icon: icon.name_icon },
      defaults: icon,
    });
  }

  console.log('Category icons seeded successfully');
};

const seedCategories = async () => {
  const categories = Array.from({ length: 30 }, (_, i) => ({
    category_name: `Category ${i + 1}`,
    category_type: i % 2 === 0 ? 'addition' : 'subtraction',
    category_icon: i + 1,
  }));

  for (const category of categories) {
    await Category.findOrCreate({
      where: { category_name: category.category_name },
      defaults: category,
    });
  }

  console.log('Categories seeded successfully');
};

module.exports = {
  seedCategoryIcons,
  seedCategories,
};
