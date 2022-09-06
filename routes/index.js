const allProducts = require("./products/all_products");
const shoes = require("./products/shoes");
const clothes = require("./products/clothes");
const cosmetics = require("./products/cosmetics");
const electronics = require("./products/electronics");


const admin = require("./roles/admin");
const delivery = require('./roles/delivery')
const done = require("./pages/done_page");
const home = require('./pages/home');
const org = require("./pages/org");
const product = require("./pages/product");
const user = require("./roles/user");
const check = require('./validation/checkCartQuantity');

module.exports = {
  admin,
  allProducts,
  clothes,
  cosmetics,
  delivery,
  done,
  electronics,
  home,
  org,
  product,
  shoes,
  user,
  check
};
