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

module.exports = seedPackages;
