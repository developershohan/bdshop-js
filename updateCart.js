export const updateCart = () => {
    let cartProducts = JSON.parse(localStorage.getItem("cartProductsLS") || "[]");
    const cart_quantity = document.querySelector(".cart_quantity");
    if (cartProducts.length > 0) {
      cart_quantity.innerHTML = cartProducts.length;
    } else {
      console.log(`0`);
    }
  };