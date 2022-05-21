const router = require("express").Router();
const mongoose = require("mongoose");
const yenepay = require("yenepaysdk");
const day = require("dayjs");
const uuid = require("uuid");

const {Orders, Products} = require('../models')
const sendEmail = require("./email");

const redirectURL = '/all'

const {
  currency,
  cancelUrlReturn,
  failureUrlReturn,
  ipnUrlReturn,
  useSandbox,
  successUrlReturn,
  sellerCode,
} = require("./yenepay_options");

router.post("/express", async (req, res) => {
  const merchantOrderId = uuid.v4();
  const expiresAfter = 2880;

  let checkoutItem = req.body;
  const id = checkoutItem.product_id.trim();

  if (!mongoose.isValidObjectId(id)) return res.redirect(redirectURL);

  const selectedProduct = await Products.findById(checkoutItem.product_id);

  if (!selectedProduct) return res.cookie('type', 'error').cookie('details', 'Unexpected error product not found').redirect(redirectURL);

  if (checkoutItem.Quantity > selectedProduct.item_in_stock)
    return res.cookie('type', 'error').cookie('details', 'The item you selected is out of stock').redirect(redirectURL);

  let order = new Orders({
    order_id: merchantOrderId,
    buyerName: checkoutItem.buyerName,
    user: req.session.user_id,
    phone: checkoutItem.phone,
    items: [
      {
        itemName: selectedProduct.title,
        quantity: checkoutItem.Quantity,
        price: selectedProduct.price,
        product: selectedProduct._id,
      },
    ],
    order_day: day().format("DD/MM/YYYY"),
  });

  await order.save();

  checkoutItem = {
    ItemName: selectedProduct.title,
    UnitPrice: selectedProduct.price,
    DeliveryFee: selectedProduct.delivery_fee,
    HandlingFee: selectedProduct.handling_fee,
    Discount: selectedProduct.discount,
    Tax1: selectedProduct.tax_1,
    Quantity: checkoutItem.Quantity,
  };

  const checkoutOptions = yenepay.checkoutOptions(
    sellerCode,
    merchantOrderId,
    yenepay.checkoutType.Express,
    useSandbox,
    expiresAfter,
    successUrlReturn,
    cancelUrlReturn,
    ipnUrlReturn,
    failureUrlReturn,
    currency
  );

  const url = yenepay.checkout.GetCheckoutUrlForExpress(
    checkoutOptions,
    checkoutItem
  );

  return res.redirect(url);
});

router.post("/cart", async (req, res) => {
  const merchantOrderId = uuid.v4();
  const expiresAfter = 2880;
  const checkoutOptions = yenepay.checkoutOptions(
    sellerCode,
    merchantOrderId,
    yenepay.checkoutType.Cart,
    useSandbox,
    expiresAfter,
    successUrlReturn,
    cancelUrlReturn,
    ipnUrlReturn,
    failureUrlReturn,
    currency
  );
  let checkoutItems = req.body.items;
  const customer = req.body.customer;

  const items = [];
  let totalItemsDeliveryFee = 0;
  let totalItemsDiscount = 0;
  let totalItemsHandlingFee = 0;
  let totalPrice = 0;

  for (let i = 0; i < checkoutItems.length; i++) {
    let id = checkoutItems[i].ItemId.trim();

    if(!mongoose.isValidObjectId(id)) return res.redirect(redirectURL)

    const item = await Products.findById(id);

    // Check if that item quantity is less
    if (checkoutItems[i].Quantity > item.item_in_stock)
      return res.cookie('type', 'error').cookie('details', `We have ${item.item_in_stock} ${item.title} in stock so lower a little`).redirect(redirectURL);

    items.push({
      itemName: item.title,
      price: item.price,
      quantity: checkoutItems[i].Quantity,
      product: item._id,
    });

    totalPrice += parseFloat(item.price) * parseInt(checkoutItems[i].Quantity);
    totalItemsDeliveryFee += parseFloat(item.delivery_fee);
    totalItemsDiscount += parseFloat(item.discount);
    totalItemsHandlingFee += parseFloat(item.handling_fee);
  }

  const order = new Orders({
    order_id: merchantOrderId,
    user: req.session.user_id,
    buyerName: customer.buyerName,
    phone: customer.phone,
    items,
    order_day: day().format("DD/MM/YYYY"),
  });

  await order.save();

  const totalItemTax1 = 0.15 * totalPrice;

  checkoutOptions.SetOrderFees(
    totalItemsDeliveryFee,
    totalItemsDiscount,
    totalItemsHandlingFee,
    totalItemTax1
  );

  checkoutItems = items.map((i) => ({
    ItemId: i.id,
    ItemName: i.itemName,
    UnitPrice: i.price,
    Quantity: i.quantity,
  }));

  const url = yenepay.checkout.GetCheckoutUrlForCart(
    checkoutOptions,
    checkoutItems
  );

  return res.json({ url });
});

router.post("/ipnurl", async (req, res) => {
  const ipnModel = req.body;

  try {
    const ipnStatus = yenepay.checkout.IsIPNAuthentic(ipnModel, useSandbox);
    return res.json({ "IPN Status": ipnStatus });
  } catch (ex) {
    console.log('Error in /ipnurl catch block')
    return res.json({ Error: ex });
  }
});

router.get("/success", async (req, res) => {
  const params = req.query;

  if (params.Status == "Paid") {
    const order = await Orders.findOne({ order_id: params.MerchantOrderId });

    if (!order) return;

    order.payed = true;
    await order.save();

    if (order.items.length == 1) {
      let item = order.items[0];
      let product = await Products.findById(item.product);

      product.item_in_stock -= item.quantity;
      await product.save();
    } else if (order.items.length > 1) {
      order.items.forEach(async (i) => {
        let product = await Products.findById(i.product);
        product.item_in_stock -= i.quantity;
        await product.save();
      });
    }

    const message = order.items.map((o) => {
      return `<h2>${o.itemName}</h2><ul><li>Quantity: ${o.quantity}</li><li>Price: ${o.price}</li><li>Total amount with tax: ${params.TotalAmount}</li><li>User: ${order.buyerName}</li><li>Phone Number: ${order.phone}</li></ul>`;
    });

    sendEmail(message); // Send the email to the admin to proceess the order


    return res
      .cookie("type", "success")
      .cookie("details", "Your ordered successfully")
      .redirect(redirectURL);
  } // end payment status == 'Paid'

  return res
    .cookie("type", "error")
    .cookie("details", "Payment failed try again")
    .redirect(redirectURL);
});

router.get("/cancel", async (req, res) => {
  return res
    .cookie("type", "error")
    .cookie("details", "You canceled the payment, we look forward to serve you")
    .redirect(redirectURL);
});

router.get("/failed", (req, res) => {
  return res
    .cookie("type", "error")
    .cookie("details", "Payment failed try again")
    .redirect(redirectURL);
});

module.exports = router;
