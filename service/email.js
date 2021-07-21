const nodemailer = require('nodemailer');
require('dotenv').config();

var transporter = nodemailer.createTransport({
  service: process.env.EMAIL_TYPE,
  auth: {
    user: process.env.SENDER_EMAIL_ADD,
    pass: process.env.EMAIL_PWD
  }
});

const sendEmail= (subject, text)=>{
      var mailOptions = {
        from: process.env.SENDER_EMAIL_ADD,
        to: process.env.RECEVER_EMAIL_ADD, // change it in production
        subject: subject,
        text: text
      };
      return new Promise((resolve, reject)=>{
        transporter.sendMail(mailOptions, function(error, info){
        if (!error) {
          return resolve(true);
        } else {
          return reject(false);
        }
      });
      });
}

module.exports = {sendEmail}