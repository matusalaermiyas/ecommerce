document.addEventListener("DOMContentLoaded", () => {
  let className = "";

  switch (window.location.pathname) {
    case "/clothes":
      className = ".clothes";
      break;

    case "/cosmetics":
      className = ".cosmetics";
      break;

    case "/electronics":
      className = ".electronics";
      break;

    case "/shoes":
      className = ".shoes";
      break;

    case "/all":
      className = ".all";
      break;

    case "/user/signin":
      className = ".signin";
      break;

    case "/user/signup":
      className = ".signup";
      break;

    case "/user/orders":
      className = ".orders";
      break;

    case "/user/rate":
      className = ".rate_product";
      break;
  }

  if (className) $("#navbar").children(className).addClass("active");

  $("#toggleNavbar").on("click", function (e) {
    const $navbar = $("#navbar");

    if ($navbar.hasClass("hidden-xs")) {
      $navbar.removeClass("hidden-xs");
      $("#navbarLogo").attr(
        "style",
        "height: 100px !important; object-fit: cover"
      );
    } else {
      $navbar.addClass("hidden-xs animate__animated animate__backOutUp");
    }
  });
});
