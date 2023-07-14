const User = require("../models/signup");

exports.postAddUser = (async (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    
    try {
        const response = await User.findAll({ where: { email: email } });
        console.log(response);
        if(response.length === 0 ){
        await User.create({
           name: name,
           email: email,
           password: password,
   
         });
          res.json({ alreadyexisting: false });
        }
        else{
         res.json({ alreadyexisting: true });
        }
     } catch (err) {
       console.log(err)
     }
   } );