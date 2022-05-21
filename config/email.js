const mail = require("nodemailer");
const day = require('dayjs')

const Errors = require('../models/error');

function sendEmail(messages) {
  let html = "";

  messages.forEach((m) => {
    html += m;
  });

  const transporter = mail.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USERNAME_FOR_EMAIL_SENDER,
      pass: process.env.PASSWORD_FOR_EMAIL_SENDER 
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_SENDER,
    to: process.env.EMAIL_RECIEVER,
    subject: "New order to deliver",
    html: html,
  };

  transporter.sendMail(mailOptions, async (err, info) => {
    if (err) {
      console.log('Error while sending email')
      const error = new Errors({
          happend_day: day().format("DD/MM/YYYY"),
          message_was: messages
      })

      await error.save();
    }
  });
}

module.exports = sendEmail;
