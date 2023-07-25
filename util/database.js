const Sequelize = require('sequelize');
const dotenv = require("dotenv");
dotenv.config();

const Default_db = process.env.DEFAULT_DATABASE;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;

const sequelize = new Sequelize(Default_db,username,password,{
    dialect:'mysql',
    host:host

});


module.exports = sequelize;