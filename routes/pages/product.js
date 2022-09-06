const router = require("express").Router();
const s = require("searchjs");

const { Products, Rates } = require("../../models");

router.get("/:id", async (req, res) => {
  const product = await Products.findById(req.params.id);
  const rates = await Rates.find({ product: req.params.id }).populate("user");
  const similarProducts = await Products.find({ type: product.type }).limit(6);

  const filtered = similarProducts.filter(
    (p) => p._id.toString() != product._id.toString()
  );

  return res.render("products/product", {
    product,
    isLogged: req.session.isLogged,
    rates: rates,
    similarProducts: filtered,
  });
});

router.post("/search/item", async (req, res) => {
  const products = await Products.find({});

  const matches = s.matchArray(products, {
    title: req.body.search,
    _text: true,
  });

  return res.render("products/search", {
    matches,
    isLogged: req.session.isLogged,
  });
});

module.exports = router;
