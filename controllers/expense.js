const Expense = require('../models/expenses');
const User = require('../models/users');
const FilesDownloaded = require('../models/filesdownloaded')
const sequelize = require('../util/database');
const { Op } = require('sequelize');
const S3services = require('../services/S3services');
const UserServices = require('../services/userservices');

exports.downloadExpense = async (req, res, next) => {
    try {
      const expenses = await UserServices.getExpenses(req);
    //   console.log(expenses);
      const strigifiedExpenses = JSON.stringify(expenses);
  
      const userId = req.user.id;
      const filename = `Expenses${userId}/${new Date()}.txt`;
  
      const fileURL = await S3services.uploadToS3(strigifiedExpenses, filename);
    //   console.log("URL: ", fileURL);
    const filesdownloaded = await FilesDownloaded.create(
      {
          url: fileURL,
          userId: userId,
      }
  );
      res.status(200).json({ fileURL: fileURL, success: true, filesdownloaded });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to upload expenses to S3.', success: false});
    }
  };
  

exports.getAddExpense = async (req, res, next) => {
  try {
    var ITEMS_Per_Page = 4;
     var page = +req.query.page || 1;

 const data = await Expense.findAll({ where: { userId: req.user.id } });

 var totalItems = await req.user.countExpenses();


var val = await req.user.getExpenses({
  offset: (page - 1) * ITEMS_Per_Page,
  limit: ITEMS_Per_Page
});

   console.log('val -->', val)
   console.log('totalItems-->', totalItems)
   console.log("next page-->", totalItems > page * ITEMS_Per_Page);

 res.json({
   val: val,
   isPremium: req.user.ispremiumuser,
   currentPage: page,
   hasNextPage:   totalItems > page * ITEMS_Per_Page  ,
   nextPage: page + 1,
   hasPreviousPage: page > 1,
   previousPage: +page - 1,
  // lastPage: Math.ceil(totalItems / ITEMS_Per_Page),
 });

} catch (err) {
        console.log(err);
    }
};

exports.getFilteredExpenses = async (req, res, next) => {
    const { startDate, endDate } = req.body;
    const userId = req.user.id;
  
    try {
      const expenses = await Expense.findAll({
        where: {
          userId: userId,
          createdAt: {
            [Op.gte]: startDate,
            [Op.lte]: endDate,
          },
        },
      });
      res.status(200).json(expenses);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'An error occurred while fetching filtered expenses.' });
    }
  };

exports.postAddExpense = async (req, res, next) => {
    const t = await sequelize.transaction(); // Begin a transaction

    try {
        const expenseAmount = req.body.expenseAmount;
        const category = req.body.category;
        const description = req.body.description;

        const expense = await req.user.createExpense(
            {
                expenseAmount: expenseAmount,
                category: category,
                description: description,
            },
            { transaction: t }
        );

        const user = await User.findByPk(req.user.id);
        user.total_expense = Number(user.total_expense) + Number(expenseAmount);
        await user.save({ transaction: t });

        await t.commit(); // Commit the transaction
        res.json(expense);
    } catch (err) {
        await t.rollback(); // Rollback the transaction in case of an error
        console.log(err);
        res.status(500).json({ error: 'An error occurred while adding the expense.' });
    }
};

exports.postDeleteExpense = async (req, res, next) => {
    const t = await sequelize.transaction(); // Begin a transaction

    try {
        const expenseId = req.params.id;

        const user = await User.findByPk(req.user.id);
        const expense = await Expense.findByPk(expenseId);
        user.total_expense = Number(user.total_expense) - Number(expense.expenseAmount);
        await user.save({ transaction: t });

        await Expense.destroy({ where: { id: expenseId }, transaction: t });

        await t.commit(); // Commit the transaction
        res.sendStatus(200);
    } catch (err) {
        await t.rollback(); // Rollback the transaction in case of an error
        console.log(err);
        res.status(500).json({ error: 'An error occurred while deleting the expense.' });
    }
};
