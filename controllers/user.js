const User = require("../models/users");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function generateAcceessToken(id) {
  return jwt.sign({ userId: id }, "secretkey");
}

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
    res.status(500).json({ message : "Something went wrong" });
    // console.log(err)
  }
});

exports.loginUser = (async (req, res, next) => {
  const email = req.body.email
  const password = req.body.password; 


  try {

    const user = await User.findAll({ where: { email: email } });


    if (user.length !== 0) {

bcrypt.compare(password, user[0].password, (err, response) => {

  if(response){
    res.status(200).json({message : "User logged in successfull", token: generateAcceessToken(user[0].id)});
    
  }
  else if(!err) {
    res.status(400).json({message : "Password is incorrect"});
    
  }
  else {
    throw new Error ({message : "Something went wrong"});

  }
})
     
    } else {
      res.status(404).json({message : "User is not registered"});

    }

  }
  catch (error) {
    res.status(500).json({message : "Something went wrong"});
    
  }

})