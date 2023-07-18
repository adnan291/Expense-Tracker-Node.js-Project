const User = require("../models/users");
const Expense = require("../models/expenses");
const sequelize = require("../util/database");

exports.getUserLeaderBoard = async (req, res) => {
  try {
    const leaderboardusers = await User.findAll({
        attributes: ['id', 'name', [sequelize.fn('sum', sequelize.col('expenses.expenseAmount')), 'total_cost']],
        include: [
          {
            model: Expense,
            attributes: []
          }
        ],
        group:  ['users.id']
      });
      
      const expenses = await Expense.findAll({
        attributes : ['userId', [sequelize.fn('sum', sequelize.col('expenses.expenseAmount')), 'total_cost']],
        group: ['userId'],
        order: [['total_cost', 'DESC']]
      });


      res.status(200).json(leaderboardusers);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};