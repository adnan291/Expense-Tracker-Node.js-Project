const User = require("../models/users");

exports.postAddUser = (async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  try {
    const response = await User.findAll({ where: { email: email } });
    // console.log(response);
    if (response.length === 0) {
      await User.create({
        name: name,
        email: email,
        password: password,

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

exports.postLoginUser = (async (req, res, next) => {
  const email = req.body.email
  const password = req.body.password;


  try {

    const res1 = await User.findAll({ where: { email: email } });


    if (res1.length !== 0) {
      const res2 = await User.findAll({ where: { email: email, password: password } });

      if (res2.length !== 0) {
        // res.json({success: true });
        res.status(200).send();

      } else {
        // res.json({ password: "incorrect" });
        res.status(401).send();

      }
    } else {
      // res.json({ success: false });
      res.status(404).send();

    }

  }
  catch (error) {
    console.log(error)
  }

})