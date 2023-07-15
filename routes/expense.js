const express = require('express');    

const path = require('path');

const contactController = require('../controllers/expense')

const router = express.Router();

router.post('/add-expense',contactController.postAddExpense)

router.get('/get-expense',contactController.getAddExpense)

router.delete('/delete-expense/:id',contactController.postDeleteExpense)

module.exports=router;