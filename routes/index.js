const allProducts = require("./all_products");
const admin = require("./admin");
const clothes = require("./clothes");
const cosmetics = require("./cosmetics");
const done = require("./done_page");
const electronics = require("./electronics");
const home = require('./home');
const org = require("./org");
const product = require("./product");
const shoes = require("./shoes");
const user = require("./user");
const check = require('./checkCartQuantity');

module.exports = {
  admin,
  allProducts,
  clothes,
  cosmetics,
  done,
  electronics,
  home,
  org,
  product,
  shoes,
  user,
  check
};
