require("dotenv").config();

const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.JWT_SECRET_TOKEN);

const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const { checkIfUserLogged, guardUserRoute } = require("../middlewares");
const { Users, Orders, Products, Rates } = require("../models");
const { respondToUser, validation, sendSms } = require("../utility");

router.get("/signin", checkIfUserLogged, (req, res) =>
  res.render("user/signin")
);

router.post("/signin", async (req, res) => {
  const user = await Users.findOne({ phone: req.body.phone });
  const url = "/user/signin";

  if (!user)
    return respondToUser(res, "Invalid email or password", "error", url);

  const validPassword =
    cryptr.decrypt(user.password) == req.body.password ? true : false;

  if (!validPassword)
    return respondToUser(res, "Invalid email or password", "error", url);

  req.session.isLogged = true;
  req.session.user_id = user._id;
  req.session.profilePicture = user.profile_picture;

  res.redirect("/user/profile");
});

router.get("/signup", checkIfUserLogged, (req, res) =>
  res.render("user/signup", { isLogged: req.session.isLogged })
);

router.post("/signup", async (req, res) => {
  const URL = "/user/signup";
  const formData = req.body;

  const { error } = validation.signup(formData);

  if (error) return respondToUser(res, error.details[0].message, "error", URL);

  const existingAccount = await Users.findOne({ phone: formData.phone });

  if (existingAccount)
    return respondToUser(
      res,
      "Phone already taken try another one",
      "error",
      "/user/signin"
    );

  if (req.files) {
    let cld_upload_stream = cloudinary.uploader.upload_stream(
      { folder: "ecommerce" },
      async (error, result) => {
        if (error)
          return respondToUser(
            res,
            "Error while uploading profile check your internet connection",
            "error",
            "/user/signup"
          );

        const encryptedPassword = cryptr.encrypt(formData.password);

        if (formData.phone.startsWith("0"))
          formData.phone =
            "+251" + formData.phone.substring(1, formData.phone.length);

        await Users.create({
          username: formData.username,
          phone: formData.phone,
          password: encryptedPassword,
          profile_picture: result.url,
        });
      }
    );

    await streamifier
      .createReadStream(req.files.profile_picture.data)
      .pipe(cld_upload_stream);
  } else
    await Users.create({
      username: formData.username,
      phone: formData.phone,
      password: encryptedPassword,
    });

  return respondToUser(
    res,
    "Account created successfully signin",
    "success",
    "/user/signin"
  );
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

  const { error } = validation.rate(formData);

  if (error) return res.send(error.details[0].message);

  await Rates.create({
    product: formData.product_id,
    rate: formData.rate,
    user: req.session.user_id,
    feedback: formData.feedback,
  });

  return res.redirect(`/product/${formData.product_id}`);
});

router.get("/forget", (req, res) => {
  return res.render("user/forget");
});

router.post("/forget", async (req, res) => {
  const account = await Users.findOne({ phone: req.body.phone });

  if (!account) return res.render("user/send_password");

  const token = jwt.sign({ _id: account._id }, process.env.JWT_SECRET_TOKEN);

  return res.render("user/send_password", { account, token });
});

router.post("/send_password", async (req, res) => {
  try {
    const token = jwt.verify(req.body.token, process.env.JWT_SECRET_TOKEN);
    const user = await Users.findById(token._id);

    if (!user) return;

    const password = cryptr.decrypt(user.password);

    sendSms(user.phone, "Your password " + password);

    return respondToUser(
      res,
      "Password sent successfully",
      "success",
      "/user/signin"
    );
  } catch (ex) {
    return respondToUser(res, "Invalid user id", "error", "/user/signin");
  }
});

router.get("/logout", guardUserRoute, (req, res) => {
  req.session.destroy();

  return res.redirect("/user/signin");
});

module.exports = router;
