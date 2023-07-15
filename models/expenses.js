const Sequelize = require('sequelize');   

const sequelize = require('../util/database');

const Expense = sequelize.define('expenses', { 
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  expenseAmount: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  category: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  }

});

module.exports = Expense; 