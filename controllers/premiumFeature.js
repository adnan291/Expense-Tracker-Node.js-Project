const User = require("../models/users");
const Expense = require("../models/expenses");
const sequelize = require("../util/database");

exports.getUserLeaderBoard = async (req, res) => {
  try {
    const leaderboardusers = await User.findAll({
        attributes: ['id', 'name', 'total_expense'],
        include: [
          {
            model: Expense,
            attributes: []
          }
        ],
        group:  ['users.id'],
        order: [['total_expense', 'DESC']]
      });
      

      res.status(200).json(leaderboardusers);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};