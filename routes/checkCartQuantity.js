const mongoose = require("mongoose");

const { Products } = require("../models");

const router = require("express").Router();

router.post("/express", async (req, res) => {
  if (!mongoose.isValidObjectId(req.body.product_id))
    return res.status(400).json({ message: "Invalid product id" });

  const product = await Products.findById(req.body.product_id);

  if (product.item_in_stock >= req.body.quantity)
    return res.json({ result: true });

  return res.json({
    result: false,
    available: product.item_in_stock,
    label: product.title,
  });
});

router.post("/cart", async (req, res) => {
  const products = req.body.products;

  // Check the products id first
  products.forEach((p) => {
    if (!mongoose.isValidObjectId(p.ItemId))
      return res.status(400).json({ message: "Invalid product id" });
  });

  // Check their amount in stock
  let errorMessages = [];

  for (var i = 0; i < products.length; i++) {
    let productInStock = await Products.findById(products[i].ItemId);

    if (products[i].Quantity > productInStock.item_in_stock) {
      errorMessages.push({
        available: productInStock.item_in_stock,
        label: productInStock.title,
      });
    }

    if (products.length - 1 == i) {
      if (errorMessages.length <= 0) return res.json({ result: true });

      return res.json({ result: false, errorMessages: errorMessages });
    }
  }
});

module.exports = router;
