const sendSms = require('./sms');
const sendEmail = require('./email');
const composeEmail = require('./composeEmail');

module.exports = {
    composeEmail,
    sendEmail,
    sendSms
}