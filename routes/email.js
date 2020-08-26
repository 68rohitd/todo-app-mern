const nodemailer = require("nodemailer");
require("dotenv").config();

function createdNewAccount(email, displayName) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "68rohitd@gmail.com",
      pass: process.env.GMAIL,
    },
  });

  const mailOptions = {
    from: "68rohitd@gmail.com", // sender address
    to: "6rohit8@gmail.com", // list of receivers
    subject: "someone created new account!", // Subject line
    html: `Name: <b>${displayName}</b> <br>email: <b>${email}</b>`, // plain text body
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) console.log(err);
    else console.log(info);
  });
}

module.exports = { createdNewAccount };
