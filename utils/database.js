const { Sequelize } = require('sequelize');

// Initialize Sequelize with PostgreSQL connection
const sequelize = new Sequelize(
  process.env.POSTGREDB,
  process.env.POSTGRESUSER,
  process.env.POSTGRESPASSWORD,
  {
    host: process.env.POSTGREHOST,
    port: process.env.POSTGRESPORT,
    dialect: 'postgres',
  }
);

// Test the connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to PostgreSQL has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = sequelize;
