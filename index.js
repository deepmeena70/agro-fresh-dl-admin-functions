const functions = require("firebase-functions");
const express = require("express");
const crypto = require("crypto");
const Razorpay = require("razorpay");

const app = express();

const order_id_generator = () => {
  const randomValues = crypto.randomBytes(8);
  return "AFO"+randomValues.join('');
}

app.get("/", (req, res) => {
  res.send("Running Agro fresh dl server!");
});

// cod

app.post('/cod', (req, res) => {
    const orderId = order_id_generator();
    const data = {
      orderId: orderId,
    }
    res.send(data);
})

// razorpay

app.post('/razorpay/create', (req, res) => {

    const total = req.query.total;
    const orderId = order_id_generator();

    var instance = new Razorpay({ key_id: 'rzp_test_UBjdvnwSJMGRzh', key_secret: 'oxAkyskNua5G9KQGFZ7KyTPM' })

    var options = {
        amount: total*100,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "order_rcptid_11"
    };
    instance.orders.create(options, function(err, order) {
        const data = {
            orderId,
            order
        }
        res.send(data);
    });
})

exports.api = functions.https.onRequest(app);
