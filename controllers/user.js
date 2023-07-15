const User = require("../models/users");
const bcrypt = require('bcrypt');

exports.signupUser = (async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  try {
    const response = await User.findAll({ where: { email: email } });
    // console.log(response);

    if (response.length === 0) {
    bcrypt.hash(password, 10, async(err,hash) => {
      await User.create({
        name: name,
        email: email,
        password: hash,

      });
    });
     
      res.json({ alreadyexisting: false });
    }
    else {
      res.json({ alreadyexisting: true });
    }
  } catch (err) {
    console.log(err)
  }
});

exports.loginUser = (async (req, res, next) => {
  const email = req.body.email
  const password = req.body.password;


  try {

    const user = await User.findAll({ where: { email: email } });


    if (user.length !== 0) {
bcrypt.compare(password, user[0].password, (err, response) => {
  if (!err) {
    // res.json({success: true });
    res.status(200).send();

  } else {
    // res.json({ password: "incorrect" });
    res.status(401).send();

  }
})
     
    } else {
      // res.json({ success: false });
      res.status(404).send();

    }

  }
  catch (error) {
    console.log(error)
  }

})