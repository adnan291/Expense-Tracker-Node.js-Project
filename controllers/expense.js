const Expense = require('../models/expenses');
const User = require('../models/users');
const sequelize = require('../util/database');
const { Op } = require('sequelize');

exports.getAddExpense = async (req, res, next) => {
    try {
        const data = await Expense.findAll({ where: { userId: req.user.id } });
        res.status(200).json(data);
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
