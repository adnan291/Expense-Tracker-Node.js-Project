const express = require('express');

const userAuthentication = require('../middleware/auth');    


const expenseController = require('../controllers/expense')

const router = express.Router();

router.post('/add-expense', userAuthentication.authenticate, expenseController.postAddExpense)

router.get('/get-expense', userAuthentication.authenticate, expenseController.getAddExpense)

router.delete('/delete-expense/:id',userAuthentication.authenticate, expenseController.postDeleteExpense)

module.exports=router;