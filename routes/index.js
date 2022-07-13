const allProducts = require("./products/all_products");
const shoes = require("./products/shoes");
const clothes = require("./products/clothes");
const cosmetics = require("./products/cosmetics");
const electronics = require("./products/electronics");


const admin = require("./admin");
const done = require("./done_page");
const home = require('./home');
const org = require("./org");
const product = require("./product");
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
