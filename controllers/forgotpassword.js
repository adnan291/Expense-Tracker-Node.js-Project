const Sib = require('sib-api-v3-sdk');
require("dotenv").config;
const User = require('../models/users');
const ForgotPassword = require('../models/forgotpassword')
const uuid = require('uuid');
const bcrypt = require('bcrypt');

const client = Sib.ApiClient.instance;

const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const tranEmailApi = new Sib.TransactionalEmailsApi();

const sender = {
    email: 'adnanmohammad995@gmail.com'
}




exports.forgotPassword = async (req, res, next) => {
  try {
    const email = req.body.email;
   
    // console.log('email->', receivers)
    const user = await User.findOne({where: {email: email}})
    //console.log(user);
      if (user) {
        const id = uuid.v4();
        // console.log('id-->',id)
        
        const resetData = await ForgotPassword.create({
          id: id,
          isactive: true,
          userId: user.id,
        });
        if (resetData) {
          try {
            console.log("data entered in reset password table successfully");
          } catch (err) {
            console.log(err);
          }
        }
        const receivers = [{ email: email }];
        const resetLink = `http://localhost:4000/password/resetpassword/${id}`;
        const htmlContent = `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6;">
            <p>Hello,</p>
            <p>We have received a request to reset your password for the Expense Tracker account.</p>
            <p>To proceed with the password reset, please click the following link:</p>
            <p><a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 4px;">Reset Password</a></p>
            <p>If you did not request a password reset, you can safely ignore this email.</p>
            <p>Thank you,</p>
            <p>The Expense Tracker Team</p>
          </body>
        </html>
      `;
        tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            from:'expensetracker@gmail.com',
            subject : 'Forgot Password',
            htmlContent : htmlContent
        })
        .then(response => {
          return res.status(200).json({message : "An email with a link to reset your password has been sent to your email address.", success: true})
        })
        .catch((error) => {
          console.error(error);
          return res.status(500).json({
            message: 'Failed to send the email. Please try again later.',
            success: false,
          });
        });
        
      } else {

        throw new Error("User does not exist");

      }
      
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Internal server error.',
      success: false,
    });
  }
}

exports.resetPassword = async (req, res, next) => {
  const id = req.params.id;
  const request = await ForgotPassword.findOne({ where: { id } });
  if (request) {
    request.update({ isactive: false });
    res.send(`<html>
                        <form action="/password/updatepassword/${id}" method="get">
                            <label for="newpassword">Enter New password</label>
                            <input name="newpassword" type="password" required></input>
                            <button>reset password</button>
                        </form>
                    </html>`);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {

    const newPassword = req.query.newpassword;
   // console.log('new password-->', newPassword);
    const id = req.params.rid;
   // console.log('id-->', id)
    const request = await ForgotPassword.findAll({ where: { id: id } });
   // console.log('req-->',request);
    const user = await User.findAll({ where: { id: request[0].userId } });
   //  console.log('user-->',user);
    if (user) {
      const saltRounds = 10;
      bcrypt.hash(newPassword, saltRounds, async function (err, hash) {
        if(err){
          console.log(err);
          throw new Error(err);
        }
        await User.update({ password: hash }, { where: { id: request[0].userId}})
         res.status(201).json({message: 'Successfuly update the new password'})

      });
    } else {
      return res.status(404).json({ error: "No User Exist", success: false });
    }
  } catch (error) {
    console.log(error);
  }
};