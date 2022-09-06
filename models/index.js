const Admin = require('./admin');
const Delivery = require('./delivery');
const DeliveryItem = require('./delivery_items');
const Error = require('./error');
const Items = require('./items');
const { Order: Orders } = require('./orders');
const Products = require('./products');
const Rates = require('./rate');
const Users = require('./user');

module.exports = {
    Admin,
    Delivery,
    DeliveryItem,
    Error,
    Items,
    Orders,
    Products,
    Rates,
    Users
};
