const router = require("express").Router();

const { Products } = require("../../models");

router.get("/", async (req, res) => {
  const currentPage = req.query.page ? req.query.page : 1;
  const pageSize = 6;
  const skip = (currentPage - 1) * pageSize;

  const count = await Products.find({ item_in_stock: { $gt: 0 } }).count();
  const pagination = Math.ceil(count / pageSize);

  const products = await Products.find({ item_in_stock: { $gt: 0 } })
    .sort("created_at")
    .skip(skip)
    .limit(pageSize);

  return res.render("products/index", {
    products: products,
    page: "/",
    pages: pagination,
    currentPage,
    isLogged: req.session.isLogged,
  });
});

module.exports = router;
