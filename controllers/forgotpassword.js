const Sib = require('sib-api-v3-sdk');
require("dotenv").config;
const User = require('../models/users');

const client = Sib.ApiClient.instance;

const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const tranEmailApi = new Sib.TransactionalEmailsApi();

const sender = {
    email: 'mohd.adnan.627492@gmail.com'
}




exports.forgotPassword = async (req, res, next) => {
  try {
    const email = req.body.email;
    const receivers = [
        {
            email: email
        }
    ]
    console.log('email->', receivers)
    // const user = await User.findOne({where: {email: email}})
    //console.log(user);
    //   if (user) {
        // const id = uuid.v4();
        // console.log('id-->',id)
        // user.createForgotpassword({ id, active: true })
        // .catch((err) => {
        //   console.log(err)
        //   throw new Error(err);
        // });
        // const resetData = await User.update({
        //   password: password
        // });
        // if (resetData) {
        //   try {
        //     console.log("data entered in reset password table successfully");
        //   } catch (err) {
        //     console.log(err);
        //   }
        // }

        tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject : 'Forgot Password',
            textContent : `
            This is your temporary message
            `
        })
          .then((response) => {
            // console.log(response[0].statusCode)
            // console.log(response[0].headers)
            return res
              .status(response[0].statusCode)
              .json({
                message: "Link to reset password sent to your mail ",
                sucess: true,
              });
          })
          .catch((error) => {
            throw new Error(error);
          });

        //send mail
    //   } else {
    //     throw new Error("User doesnt exist");
    //   }

  } catch (err) {
    console.log(err)


  }
}