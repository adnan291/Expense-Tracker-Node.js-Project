const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const buyPremium = require('./routes/purchase');
const premiumRoutes = require('./routes/premiumFeature')


const app = express();
const signupRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');

app.use(bodyParser.json({ extended: false }));
app.use(cors());


const sequelize = require('./util/database');
const User = require('./models/users');
const Expense = require('./models/expenses');
const Order = require('./models/orders')

app.use('/user', signupRoutes);
app.use('/expense', expenseRoutes);
app.use("/purchase", buyPremium);
app.use("/premium", premiumRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

sequelize.sync().then((result) => {
    app.listen(4000);
}).catch((err) => {
    console.log(err);
});


app.use((req, res, next) => {
    res.status(404).send('<h1>Page Not Found</h1>')
});