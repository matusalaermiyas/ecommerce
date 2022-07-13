module.exports = (order, totalAmount) =>
  order.items.map(
    (o) =>
      `<h2>${o.itemName}</h2><ul><li>Quantity: ${o.quantity}</li><li>Price: ${o.price}</li><li>Total amount with tax: ${totalAmount}</li><li>User: ${order.buyerName}</li><li>Phone Number: ${order.phone}</li></ul>`
  );
