const Category = require('../models/category');
const CategoryIcon = require('../models/category-icon');
const Package = require('../models/package');

const seedPackages = async () => {
  const packages = [
    { name_package: 'Basic', price: 999, days_duration: 30 },
    { name_package: 'Standard', price: 1999, days_duration: 90 },
    { name_package: 'Premium', price: 2999, days_duration: 180 },
    { name_package: 'Ultimate', price: 4999, days_duration: 365 },
  ];

  for (const pkg of packages) {
    await Package.findOrCreate({
      where: { name_package: pkg.name_package },
      defaults: pkg,
    });
  }

  console.log('Packages seeded successfully');
};

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
  seedPackages,
  seedCategoryIcons,
  seedCategories,
};
