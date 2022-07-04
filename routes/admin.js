const day = require("dayjs");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Joi = require('joi');
const bcrypt = require('bcryptjs')


const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");


const { Products, Admin } = require('../models');
const { adminGuard } = require("../middlewares");


router.get("/add", adminGuard, (req, res) => {
  return res.render("admin/add_product", {isLogged: req.session.isLogged});
});

router.get("/login", (req, res) => {
  return res.render("admin/login", {isLogged: req.session.isLogged});
});

router.post("/login", async (req, res) => {
  const admin = await Admin.findOne({ email: req.body.email });

  if (!admin) return res.redirect("/root/login");

  const matched = await bcrypt.compare(req.body.password, admin.password);

  if (!matched) return res.redirect("/root/login");
  

  const token = jwt.sign({ isAdmin: admin.isAdmin }, process.env.JWT_SECRET_TOKEN, {
    expiresIn: "1h",
  });

  return res
    .cookie("token", token, {
      expires: new Date(Date.now() + 900000),
    })
    .redirect("/root/add");
});


router.post("/add", async (req, res) => {
  const product = req.body;

  product.type = product.type.toLowerCase();
  product.status = product.status.toLowerCase();
  
  const { error } = validate(product);

  if(error) return res.cookie('type', 'error').cookie('details', error.details[0].message).redirect('/root/add')



  
  let cld_upload_stream = cloudinary.uploader.upload_stream(
    {
      folder: "ecommerce",
    },
    async  (error, result) => {
      if(error) return res.send('Error while uploading try again.');
      await Products.create({
        ...product,
        image: result.url,
        created_at: day().format("DD/MM/YYYY"),
      });
    }
  );

  streamifier
    .createReadStream(req.files.image.data)
    .pipe(cld_upload_stream);

  res.cookie('type', 'success').cookie('details', 'Product added successfully').redirect('/root/add');
});

function validate(data)
{
  const schema = Joi.object({
    title: Joi.string().required().label("Product Title"),
    item_in_stock: Joi.number().min(0).label("Item In Stock"),
    delivery_fee: Joi.number().min(0).label("Delivery Fee"),
    handling_fee: Joi.number().min(0).label("Handling Fee"),
    discount: Joi.number().min(0).label("Discount"),
    tax_1: Joi.number().min(0).label("Tax"),
    description: Joi.string().required().label("Description"),
    price: Joi.number().min(0).required().label("Price"),
    type: Joi.string().valid('clothes', 'cosmetics', 'electronics', 'shoes'),
    status: Joi.string().valid('new', 'used'),
  })

  return schema.validate({...data})
}

module.exports = router;
