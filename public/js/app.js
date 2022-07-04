let customer = {};

document.addEventListener("DOMContentLoaded", () => {
  const itemsInCart = jar.get("cart_counter") ? jar.get("cart_counter") : 0;

  const cartCounter = document.getElementById("cartCounter");
  cartCounter.innerText = itemsInCart;

  if (itemsInCart <= 0) {
    $("#checkout").attr("style", "display: none;");

    window.location.href = "/all";
  }

  let cartItems = jar.get("items");
  cartItems = JSON.parse(cartItems);

  Object.keys(cartItems).forEach((k) => {
    let item = cartItems[k];
    let element = `<div class="row" style="margin-bottom: 10px; clear: both;">
				<div class="col-sm-5" style="position: relative;">
          <div style="width: 100px; height: 100px; object-fit: cover">
					  <img src="${item.itemImage}" class="img-responsive" alt="${
      item.itemName
    }" style="border-radius: 5px;">
          </div>
        </div>

				<div class="description col-sm-5">
						<p>${item.itemName}</p>
						<p>Unit Price: ${item.itemPrice} Birr</p>
						<p>Quantity: ${item.Quantity}</p>
						<p>Total Price: ${item.Quantity * item.itemPrice} Birr</p>
						<button class="plus btn btn-primary btn-sm" data-id="${item.ItemId}">
							<span class='glyphicon glyphicon-plus'></span>
						</button>

						<button class="minus btn btn-primary btn-sm" data-id="${item.ItemId}">
							<span class='glyphicon glyphicon-minus'></span>
						</button>

						<button class="remove btn btn-danger btn-sm" data-id="${item.ItemId}">
							<span class='glyphicon glyphicon-remove'></span>
						</button>
						
				</div>
				</div>`;

    $("#root").append(element);
  });

  $(".remove").on("click", function (e) {
    const btn = $(this);

    delete cartItems[btn.attr("data-id")];
    jar.set("items", JSON.stringify(cartItems));
    jar.set("cart_counter", JSON.stringify(Object.keys(cartItems).length));

    window.location.reload();
  });

  $("#checkout").on("click", async (e) => {
    const itemsInCart = JSON.parse(jar.get("items"));
    const items = [];

    Object.keys(itemsInCart).forEach((k) => {
      items.push(itemsInCart[k]);
    });

    try {
      const { data } = await axios.post("/check/cart", { products: items });

      if (!data.result) {
        data.errorMessages.forEach((e) => {
          Swal.fire({
            icon: "error",
            title: `We have ${e.available} ${e.label} in stock lower it little`,
            text: "Lower to available items",
            width: "40%",
          });
        });
        return;
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: `Unexpected error, occured try your connection`,
        text: "Try to refresh",
        width: "40%",
      });
      return;
    }

    const { value } = await Swal.fire({
      title: "Your info",
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Name">' +
        '<input id="swal-input2" class="swal2-input" placeholder="Phone">',
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById("swal-input1").value,
          document.getElementById("swal-input2").value,
        ];
      },
      width: "500px",
    });

    if (!value || value[0] == "" || value[1] == "") {
      Swal.fire({
        icon: "error",
        title: "Oops",
        text: "Fill all forms correctly",
      });
      return;
    }

    const user = jar.get("user");

    customer["buyerName"] = value[0];
    customer["phone"] = value[1];
    customer["id"] = user;

    try {
      const { data } = await axios.post("http://localhost:7070/payment/cart", {
        items,
        customer,
      });

      jar.remove("items");

      window.location.href = data.url;
    } catch (ex) {
      console.log(ex);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unexpected error occured",
      });
    }
  });

  $(".plus").on("click", function (e) {
    const btn = $(this);

    const item = cartItems[btn.attr("data-id")];

    let counter = parseInt(item.Quantity);

    counter++;
    item.Quantity = counter.toString();

    jar.set("items", JSON.stringify(cartItems));

    window.location.reload();
  });

  $(".minus").on("click", function (e) {
    const btn = $(this);

    const item = cartItems[btn.attr("data-id")];

    let counter = parseInt(item.Quantity);

    counter--;

    if (counter <= 0) {
      delete cartItems[btn.attr("data-id")];
      jar.set("cart_counter", JSON.stringify(Object.keys(cartItems).length));
    } else item.Quantity = counter.toString();

    jar.set("items", JSON.stringify(cartItems));
    window.location.reload();
  });
});
