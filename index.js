require("./config/db")();
require("express-async-errors");

const expressConfig = require('./config/express');
const express = require("express");

const app = express();

expressConfig(app)

const PORT = process.env.PORT || 7070;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));