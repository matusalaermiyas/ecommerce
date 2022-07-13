const Joi = require('joi')

function adminValidation(data) {
  const schema = Joi.object({
    title: Joi.string().required().label("Product Title"),
    item_in_stock: Joi.number().min(0).label("Item In Stock"),
    delivery_fee: Joi.number().min(0).label("Delivery Fee"),
    handling_fee: Joi.number().min(0).label("Handling Fee"),
    discount: Joi.number().min(0).label("Discount"),
    tax_1: Joi.number().min(0).label("Tax"),
    description: Joi.string().required().label("Description"),
    price: Joi.number().min(0).required().label("Price"),
    type: Joi.string().valid("clothes", "cosmetics", "electronics", "shoes"),
    status: Joi.string().valid("new", "used"),
  });

  return schema.validate({ ...data });
}

function signup(data) {
  const schema = Joi.object({
    username: Joi.string().required().label("Username"),
    phone: Joi.string().required().label("Phone"),
    password: Joi.string().required("Password"),
  });

  return schema.validate({ ...data });
}

function rate(data) {
  const schema = Joi.object({
    product_id: Joi.string().required().label("Product Id"),
    rate: Joi.number().min(0).label("Rate"),
    feedback: Joi.string().required("Feedback"),
    score: Joi.any(),
  });

  return schema.validate({ ...data });
}

module.exports = {
  adminValidation,
  rate,
  signup
};
