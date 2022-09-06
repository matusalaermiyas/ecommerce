const router = require("express").Router();

const { DeliveryItem, Delivery } = require("../../models");


router.get("/login", (req, res) =>
  res.render("delivery/signin", { isLogged: req.session.isLogged })
);

router.post("/login", async (req, res) => {
    const delivery = await Delivery.findOne({email: req.body.email});

    if(!delivery) return res.redirect('/delivery/login');
    if(!(delivery.password == req.body.password)) return res.redirect('/delivery/login');

    req.session.delivery = delivery._id;

    return res.redirect('/delivery/tasks')
});


router.get('/tasks', async (req, res) => {
    const itemsToDeliver = await DeliveryItem.findOne({delivery: req.session.delivery});

    return res.render('delivery/tasks', {itemsToDeliver, isLogged: req.session.isLogged})
})

router.get('/details/:id', async (req, res) => {
  const orders = await DeliveryItem.findOne({delivery: req.session.delivery});

  const order = orders.delivery_items.filter(i => i.order.order_id == req.params.id);

  return res.render('delivery/item_details', {order: order[0], isLogged: req.session.isLogged})
})

router.post('/set-delivered', async (req, res) => {
  const orders = await DeliveryItem.findOne({delivery: req.session.delivery});

  const order = orders.delivery_items.find(i => i.order.order_id == req.body.order_id);
  order.delivered = true;

  console.log(orders);


  await orders.save();

  return res.redirect('/delivery/tasks')

})

module.exports = router;

// https://www.youtube.com/watch?v=DHEOF_rcND8&ab_channel=RoughTradeRecords