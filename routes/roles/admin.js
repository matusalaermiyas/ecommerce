const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary").v2;
const day = require("dayjs");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const streamifier = require("streamifier");

const _ = require("lodash");

const {
  Products,
  Admin,
  DeliveryItem,
  Delivery,
  Orders,
} = require("../../models");
const { adminGuard } = require("../../middlewares");
const { adminValidation: validate } = require("../../utility/validation");
const { respondToUser } = require("../../utility");

router.get("/add", adminGuard, (req, res) =>
  res.render("admin/add_product", { isLogged: req.session.isLogged })
);

router.get("/login", (req, res) =>
  res.render("admin/login", { isLogged: req.session.isLogged })
);

router.post("/login", async (req, res) => {
  const admin = await Admin.findOne({ email: req.body.email });

  if (!admin) return res.redirect("/root/login");

  const matched = await bcrypt.compare(req.body.password, admin.password);

  if (!matched) return res.redirect("/root/login");

  const token = jwt.sign(
    { isAdmin: admin.isAdmin },
    process.env.JWT_SECRET_TOKEN,
    {
      expiresIn: "1h",
    }
  );

  return res
    .cookie("token", token, {
      expires: new Date(Date.now() + 900000),
    })
    .redirect("/root/add");
});

router.post("/add", adminGuard, async (req, res) => {
  const product = req.body;

  if (!req.files)
    return respondToUser(res, "Enter Product Image", "error", "/root/add");

  product.type = product.type.toLowerCase();
  product.status = product.status.toLowerCase();

  const { error } = validate(product);

  if (error)
    return respondToUser(res, error.details[0].message, "error", "/root/add");

  let cld_upload_stream = cloudinary.uploader.upload_stream(
    {
      folder: "ecommerce",
    },
    async (error, result) => {
      if (error)
        respondToUser(
          res,
          "Error while uploading try again",
          "error",
          "/root/add"
        );

      await Products.create({
        ...product,
        image: result.url,
        created_at: day().format("DD/MM/YYYY"),
      });
    }
  );

  streamifier.createReadStream(req.files.image.data).pipe(cld_upload_stream);

  return respondToUser(
    res,
    "Product added successfully",
    "success",
    "/root/add"
  );
});

router.get("/assign-to-delivery", async (req, res) => {
  const deliveryEmployees = await Delivery.find({});
  const orders = await Orders.find({ delivered: false, payed: true });

  return res.render("admin/assign_task", {
    orders,
    deliveryEmployees,
    isLogged: req.session.isLogged,
  });
});

router.post("/assign-to-delivery", async (req, res) => {
  const order = await Orders.findById(req.body.order);
  let delivery = await DeliveryItem.findOne({ delivery: req.body.delivery });

  if (!delivery) {
    await DeliveryItem.create({
      delivery: req.body.delivery,
      delivery_items: [
        {
          order,
        },
      ],
    });

    return respondToUser(
      res,
      "Task assigned to delivery successsfully",
      "success",
      "/root/assign-to-delivery"
    );
  }

  delivery.delivery_items.push({
    order,
  });

  await delivery.save();

  return respondToUser(
    res,
    "Task assigned to delivery successsfully",
    "success",
    "/root/assign-to-delivery"
  );
});

router.get("/logout", adminGuard, (req, res) =>
  res.cookie("token", "").redirect("/")
);

module.exports = router;