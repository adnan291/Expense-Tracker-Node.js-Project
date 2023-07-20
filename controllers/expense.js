const Expense = require('../models/expenses');
const User = require('../models/users');
 
exports.getAddExpense =( async (req,res,next)=>{

    try{
        const data = await  Expense.findAll({where : { userId : req.user.id}})
        res.json(data);
    }
    catch(err){
        console.log(err)}
});

exports.postAddExpense=( async (req,res,next) => {
    try{
    const expenseAmount=req.body.expenseAmount;
    const category=req.body.category;
    const description=req.body.description;

    const data = await req.user.createExpense({
        expenseAmount : expenseAmount,
        category : category,
        description : description
    });

    const user = await User.findByPk(req.user.id);
    user.total_expense = user.total_expense + parseFloat(expenseAmount);
    await user.save();

     res.json(data);
     }


    catch(err)   {
        console.log(err)
    };

    //res.redirect('/');
})

exports.postDeleteExpense=( async (req, res,  next) => {


     try {
           const expenseId = req.params.id;
           
           const user = await User.findByPk(req.user.id);
           const expense = await Expense.findByPk(expenseId);
           user.total_expense = user.total_expense - parseFloat(expense.expenseAmount);
           await user.save();

      const data = await Expense.destroy({ where: {id:expenseId}});
      res.sendStatus(200); 
    } 
     catch(err){
        console.log(err);
     }
}); 