export const updateCart = () => {
    let cartProducts = JSON.parse(localStorage.getItem("cartProductsLS") || "[]");
    const cart_quantity = document.querySelectorAll(".cart_quantity");
    if (cartProducts.length > 0) {
      cart_quantity.forEach((item)=>{

        item.innerHTML = cartProducts.length;
      })
      
    } else {
      console.log(`0`);
    }
  };