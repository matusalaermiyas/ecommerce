const shoesRouter = require("express").Router();

const {Products} = require("../models");

shoesRouter.get("/", async (req, res) => {
  const currentPage = req.query.page ? req.query.page : 1;
  const pageSize = 6;
  const skip = (currentPage - 1) * pageSize;

  const count = await Products.find({})
    .where("type")
    .equals("clothes")
    .where("item_in_stock")
    .gt(0);

  const pagination = Math.ceil(count / pageSize);

  const shoes = await Products.find({})
    .where("type")
    .equals("shoes")
    .where("item_in_stock")
    .gt(0)
    .skip(skip)
    .limit(pageSize);

  return res.render("products/shoes", {
    products: shoes,
    page: "/shoes",
    pages: pagination,
    currentPage: currentPage,
    isLogged: req.session.isLogged,
  });
});

module.exports = shoesRouter;
