const axios = require("axios");

const sendSms = async (phoneNumber, message) => {
  const data = JSON.stringify({
    phone: phoneNumber,
    message: message,
  });

  const config = {
    method: "post",
    url: "https://api.telda.com.et/api/write/SendMessage",
    headers: {
      accept: "text/plain",
      "Content-Type": "application/json",
      Authorization: process.env.SMS_API_KEY,
    },
    data: data,
  };

  try {
    await axios(config);
  } catch (error) {
    console.error("Error while sending sms");
  }
};

module.exports = sendSms;