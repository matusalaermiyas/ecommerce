const router = require("express").Router();

const { Products } = require("../models");

const _ = require("lodash");

router.get("/", async (req, res) => {
  const products = await Products.find({})
    .limit(12)
    .sort({ inserted_at: "desc" });

  let featured = _.shuffle(products);
  featured = _.take(featured, 8);

  let newArrival = _.shuffle(products);
  newArrival = _.take(featured, 8);

  return res.render("welcome", {
    isLogged: req.session.isLogged,
    featured,
    newArrival,
  });
});

module.exports = router;
