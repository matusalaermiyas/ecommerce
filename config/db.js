const mongoose = require("mongoose");

function connectToDB() {
  mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log("Connected to mongodb"))
    .catch((err) => console.log(err));
}

module.exports = connectToDB;
