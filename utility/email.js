const nodemailer = require("nodemailer");

require('dotenv').config()

const sendEmail = async (messages) => {
  let html = "";

  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SENDER_USERNAME,
      pass: process.env.SENDER_PASSWORD,
    },
  });

  messages.forEach((m) => (html += m));

  try {
    transporter.sendMail({
      from: process.env.SENDER_USERNAME,
      to: process.env.RECIEVER_USERNAME,
      subject: "New Delivery ✔",
      text: "Deliver this items to customer",
      html: html,
    });
  } catch (error) {
    console.log("Error while sending email...");
  }
};

module.exports = sendEmail;
