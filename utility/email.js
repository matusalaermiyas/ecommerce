require('dotenv').config()

var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');


const sendEmail = async (messages) => {
  let html = "";
  messages.forEach((m) => (html += m));

  var options = {
    auth: {
      api_key: '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'
    }
  }
  
  var client = nodemailer.createTransport(sgTransport(options));
  
  var email = {
    from: 'matusalaermiyas07@gmail.com',
    to: 'svgphntm07@gmail.com',
    subject: 'New Order To Deliver',
    text: 'These are the new orders to deliver',
    html: html
  };
  
  client.sendMail(email, function(err, info){
      if (err ){
        console.log(err);
      }
  });
  
};

module.exports = sendEmail;

