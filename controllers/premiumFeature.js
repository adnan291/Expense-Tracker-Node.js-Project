const User = require("../models/users");
const Expense = require("../models/expenses");
const FilesDownloaded = require("../models/filesdownloaded");


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

exports.getDownloadedURL = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    const filesdownloaded = await FilesDownloaded.findAll({
      where: {
        userId: userId
      },
      order: [['createdAt', 'DESC']]
      });
      

      res.status(200).json(filesdownloaded);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};