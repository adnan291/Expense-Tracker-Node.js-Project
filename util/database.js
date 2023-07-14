const Sequelize = require('sequelize');

const sequelize = new Sequelize('expense_tracker_nodejs','root','',{
    dialect:'mysql',
    host:'localhost'

});


module.exports = sequelize;