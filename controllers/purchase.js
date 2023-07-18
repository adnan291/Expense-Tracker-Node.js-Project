const Razorpay = require("razorpay");
const Order = require("../models/orders");
const dotenv = require("dotenv");

dotenv.config();

exports.postPurchase = async (req, res) => {
  try {
    var rzp = new Razorpay({
      key_id: process.env.RAZORPAP_KEY_ID,
      key_secret: process.env.RAZORPAP_KEY_SECRET
    })
   // console.log("rzp object->>",rzp)
    const amount = 9900;
    rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
     // console.log('err ->> ',err)
      if (err) {
        throw new Error(JSON.stringify(err));
      }
      console.log(order)
      console.log(order.id, 'order id')
      console.log(req.user.id)
      req.user.createOrder({ orderid: order.id, status: "PENDING" }).then(() => {
          return res.status(201).json({ order, key_id: rzp.key_id });
        })
        .catch(err => {
          throw new Error(err);
        });
    });
  } catch (err) {
    console.log(err);
     res.status(403).json({ message: "Sometghing went wrong", error: err });
  }
};

exports.updateTransactonStatus = async (req, res) => {
  try {
    const { order_id, payment_id} = req.body;
    Order.findOne({ where : { orderid : order_id }}).then((order) => {
      order.update({ paymentid: payment_id, status: "Successfull" }).then(() => {
          req.user.update({ ispremiumuser: true }).then(() => {
              return res.status(202).json({ success: true, message: "Transaction Successful" });
            })
            .catch((err) => {
              throw new Error(err);
            })

          }).catch((err) => {
            throw new Error(err);
          })
    })


  } catch (err) {
    console.log(err)
  }
};