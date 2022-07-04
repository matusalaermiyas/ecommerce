const path = require("path");
const cookie = require("cookie-parser");
const fileUpload = require('express-fileupload');
const express = require("express");
const session = require("express-session");
const cors = require('cors');


const sessionConfig = {
  secret:  process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
};

const { error, _404 } = require('../middlewares')

const { adminJs, router } = require("./admin");
const {
  admin,
  allProducts,
  check,
  clothes,
  cosmetics,
  done,
  electronics,
  home,
  org,
  product,
  shoes,
  user,
} = require("../routes");
const payment = require("../config/yenepay");

module.exports = (app) => {

  app.use(adminJs.options.rootPath, router);
  app.use(cors())
  app.use(express.static(path.join(process.cwd(), "public")));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(fileUpload())
  app.use(cookie());
  app.use(session(sessionConfig));

  app.set("view engine", "ejs");

  app.use('/', home);
  app.use("/all", allProducts);
  app.use("/product", product);
  app.use("/root", admin);
  app.use('/check', check);
  app.use("/clothes", clothes);
  app.use("/cosmetics", cosmetics);
  app.use("/electronics", electronics);
  app.use("/payment", payment);
  app.use("/shoes", shoes);
  app.use("/org", org);
  app.use("/done", done);
  app.use("/user", user);
  app.use(_404);
  app.use(error);
};
