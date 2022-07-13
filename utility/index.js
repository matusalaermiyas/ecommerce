const sendSms = require('./sms');
const sendEmail = require('./email');
const composeEmail = require('./composeEmail');
const respondToUser = require('./respondToUser')
const validation = require('./validation');

module.exports = {
    composeEmail,
    sendEmail,
    sendSms,
    respondToUser, 
    validation
}