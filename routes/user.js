require("dotenv").config();

const Joi = require("joi");
const bcrypt = require("bcryptjs");
const router = require("express").Router();

const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const { checkIfUserLogged, guardUserRoute } = require("../middlewares");
const { Users, Orders, Products, Rates } = require("../models");


router.get("/signin", checkIfUserLogged, (req, res) => {
  return res.render("user/signin");
});

router.post("/signin", async (req, res) => {
  const user = await Users.findOne({ phone: req.body.phone });
  const url = "/user/signin";

  if (!user)
    return res
      .cookie("type", "error")
      .cookie("details", "Invalid email or password")
      .redirect(url);

  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword)
    return res
      .cookie("type", "error")
      .cookie("details", "Invalid email or password")
      .redirect(url);

  req.session.isLogged = true;
  req.session.user_id = user._id;
  req.session.profilePicture = user.profile_picture;

  res.redirect("/user/profile");
});

router.get("/signup", checkIfUserLogged, (req, res) => {
  return res.render("user/signup", { isLogged: req.session.isLogged });
});

router.post("/signup", async (req, res) => {
  const url = "/user/signup";
  const formData = req.body;

  const { error } = validateSignup(formData);

  if (error) {
    return res
      .cookie("type", "error")
      .cookie("details", error.details[0].message)
      .redirect(url);
  }

  const existingAccount = await Users.findOne({ phone: formData.phone });

  if (existingAccount) {
    return res
      .cookie("type", "error")
      .cookie("details", "Phone already taken try another one")
      .redirect(url);
  }

  let cld_upload_stream = cloudinary.uploader.upload_stream(
    {
      folder: "ecommerce",
    },
    async  (error, result) => {
      if(error) return res.send('Error while uploading try again.');

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(formData.password, salt);

        await Users.create({
      username: formData.username,
      phone: formData.phone,
      password: hashedPassword,
      profile_picture: result.url,
    });

      
    }
  );

  await streamifier
    .createReadStream(req.files.profile_picture.data)
    .pipe(cld_upload_stream);


  return res
    .cookie("type", "success")
    .cookie("details", "Account created successfully signin")
    .redirect("/user/signin");
});

router.get("/profile", guardUserRoute, (req, res) => {
  return res.render("user/profile", {
    isLogged: req.session.isLogged,
    user_id: req.session.user_id,
    profilePicture: req.session.profilePicture,
  });
});

router.get("/orders", guardUserRoute, async (req, res) => {
  const orders = await Orders.find({ user: req.session.user_id });

  res.render("user/orders", {
    orders,
    isLogged: req.session.isLogged,
    user_id: req.session.user_id,
    profilePicture: req.session.profilePicture,
  });
});

router.get("/rate", guardUserRoute, async (req, res) => {
  const currentPage = req.query.page ? req.query.page : 1;
  const pageSize = 6;
  const skip = (currentPage - 1) * pageSize;

  const count = await Products.find().count();
  const pagination = Math.ceil(count / pageSize);

  const products = await Products.find()
    .sort("created_at")
    .skip(skip)
    .limit(pageSize);

  return res.render("user/rate_product", {
    products,
    currentPage,
    pages: pagination,
    page: "/user/rate",
    isLogged: req.session.isLogged,
    user_id: req.session.user_id,
    profilePicture: req.session.profilePicture,
  });
});

router.post("/rate", guardUserRoute, async (req, res) => {
  const formData = req.body;

  const { error } = validateRate(formData);

  if (error) return res.send(error.details[0].message);

  await Rates.create({
    product: formData.product_id,
    rate: formData.rate,
    user: req.session.user_id,
    feedback: formData.feedback,
  });

  return res.redirect(`/product/${formData.product_id}`);
});

router.get("/logout", guardUserRoute, (req, res) => {
  req.session.destroy();

  return res.redirect("/user/signin");
});

function validateSignup(data) {
  const schema = Joi.object({
    username: Joi.string().required().label("Username"),
    phone: Joi.string().required().label("Phone"),
    password: Joi.string().required("Password"),
  });

  return schema.validate({ ...data });
}

function validateRate(data) {
  const schema = Joi.object({
    product_id: Joi.string().required().label("Product Id"),
    rate: Joi.number().min(0).label("Rate"),
    feedback: Joi.string().required("Feedback"),
    score: Joi.any(),
  });

  return schema.validate({ ...data });
}

module.exports = router;
