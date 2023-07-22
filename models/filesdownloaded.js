const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const FilesDownloaded = sequelize.define("filesdownloaded", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  url: {
    type: Sequelize.STRING,
  }
});

module.exports = FilesDownloaded;