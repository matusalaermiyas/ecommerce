const clothesRouter = require("express").Router();

const { Products } = require("../../models");

clothesRouter.get("/", async (req, res) => {
  const currentPage = req.query.page ? req.query.page : 1;
  const pageSize = 6;
  const skip = (currentPage - 1) * pageSize;

  const count = await Products.find({})
    .where("type")
    .equals("clothes")
    .where("item_in_stock")
    .gt(0);

  const pagination = Math.ceil(count / pageSize);

  const clothes = await Products.find()
    .where("type")
    .equals("clothes")
    .where("item_in_stock")
    .gt(0)
    .skip(skip)
    .limit(pageSize);

  return res.render("products/clothes", {
    products: clothes,
    page: "/clothes",
    pages: pagination,
    currentPage: currentPage,
    isLogged: req.session.isLogged,
  });
});

module.exports = clothesRouter;