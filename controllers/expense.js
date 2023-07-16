const Expense = require('../models/expenses');
 
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
    })
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
   const data = await Expense.destroy({ where: {id:expenseId}});
      res.sendStatus(200); 
    } 
     catch(err){
        console.log(err);
     }
}); 