
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

var options = {
  auth: {
    api_key: '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'
  }
}

var client = nodemailer.createTransport(sgTransport(options));

var email = {
  from: 'matusalaermiyas07@gmail.com',
  to: 'svgphntm07@gmail.com',
  subject: 'Hello',
  text: 'Hello world',
  html: '<b>Hello world</b>'
};

client.sendMail(email, function(err, info){
    if (err ){
      console.log(err);
    }
    else {
      console.log('Message sent: ' + info.response);
    }
});