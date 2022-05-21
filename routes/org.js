const router = require("express").Router();

router.get("/about", (req, res) => {
  return res.render("org/about", { isLogged: req.session.isLogged });
});
router.get("/faq", (req, res) => {
  return res.render("org/FAQ", { isLogged: req.session.isLogged });
});
router.get("/payment", (req, res) => {
  return res.render("org/payment", { isLogged: req.session.isLogged });
});
router.get("/privacy", (req, res) => {
  return res.render("org/privacy_and_policy", {
    isLogged: req.session.isLogged,
  });
});
router.get("/shipping", (req, res) => {
  return res.render("org/shipping", { isLogged: req.session.isLogged });
});

router.get("/track", (req, res) => {
  return res.render("org/track", { isLogged: req.session.isLogged });
});

router.get("/contact", (req, res) => {
  return res.render("org/contact", { isLogged: req.session.isLogged });
});

module.exports = router;
