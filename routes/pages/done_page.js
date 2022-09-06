const router = require("express").Router();

router.get("/", (req, res) => {
  return res.render("done", {isLogged: req.session.isLogged});
});

module.exports = router;
