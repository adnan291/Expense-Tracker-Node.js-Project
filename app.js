const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const dotenv = require("dotenv");
dotenv.config();


const buyPremium = require('./routes/purchase');
const premiumRoutes = require('./routes/premiumFeature')
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const forgotpassRoutes = require('./routes/forgotpassword');

const accessLogSystem = fs.createWriteStream(path.join(__dirname, 'access.log'),
{flags : 'a'});

const app = express();
app.use(bodyParser.json({ extended: false }));
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan('combined', {stream : accessLogSystem}))

const sequelize = require('./util/database');

const User = require('./models/users');
const Expense = require('./models/expenses');
const Order = require('./models/orders')
const Forgotpassword = require('./models/forgotpassword');
const FilesDownloaded = require('./models/filesdownloaded');

app.use('/user', userRoutes);
app.use('/password',forgotpassRoutes);
app.use('/expense', expenseRoutes);
app.use("/purchase", buyPremium);
app.use("/premium", premiumRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

User.hasMany(FilesDownloaded);
FilesDownloaded.belongsTo(User); 

const port = process.env.PORT_NUMBER;

sequelize.sync().then((result) => {
    app.listen(port || 3000, () => {
        console.log("The app is running on port http://127.0.0.1:" + port);
        });
}).catch((err) => {
    console.log(err);
});


app.use((req, res, next) => {
    res.status(404).send('<h1>Page Not Found</h1>')
});