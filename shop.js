import { getCartProductFromLS } from "./getCartProductFromLS.js";
import { updateCart } from "./updateCart.js";

updateCart();
// get product from api

const getProduct = async () => {
  try {
    const res = await axios.get(
      "https://backend-captain-api.vercel.app/api/v1/product/"
    );
    const products = res.data;

    let content = "";

    if (products.length > 0) {
      products.forEach((product, index) => {
        content += `
            <div
              class="card lg:w-[31%] md:w-[47%] w-full flex flex-col justify-center items-center text-center gap-5" id = ${product._id}>
              <div class="product_img w-full relative overflow-hidden">
                <a href="./singlePage.html?id=${product._id}">
                  <img
                    class="w-full bg-black h-[300px] object-cover"
                    src="${product.imageUrl}"
                    alt="" />
                </a>
                <div
                  class="add_to_cart_icon cursor-pointer absolute bg-red-600 flex justify-center items-center p-5 bottom-0 right-0" data-quantity="1">
                  <svg role="img" class="h-6 w-6 fill-white">
                    <use xlink:href="assets/img/sprite.svg#shopping-basket"></use>
                  </svg>
                </div>
              </div>
              <div class="product_details">
                <p class="product_category">${product.category}</p>
                <a
                  href="./cart.html"
                  class="hover:text-red-500 text-[18px] font-bold">
                  ${product.name}</a
                >
                <p data-item="1" class="product_quantity hidden">1</p>
                <p class="price font-bold text-[16px]">
                  $<span class="sale_price text-red-500 pr-1">${product.basePrice}</span>
                  <span class="regular_price line-through text-gray-400">$80</span>
                </p>
              </div>
            </div>
          
          `;
      });
      const product_container = document.querySelector(
        ".product_section .container"
      );

      if (product_container) {
        product_container.innerHTML = content;
      }

      // add to cart
      let lsProduct = getCartProductFromLS();
      const add_to_cart_icon = document.querySelectorAll(".add_to_cart_icon");

      add_to_cart_icon.forEach((button) => {
        button.addEventListener("click", (e) => {
          const cardElement = e.target.closest(".card");
          let id = cardElement.id;
          let price = Number(
            cardElement.querySelector(".sale_price").innerHTML
          );
          let quantity = Number(
            cardElement.querySelector(".product_quantity").innerHTML
          );

          const existingItemLs = lsProduct.find((item) => item.id === id);

          if (existingItemLs) {
            // Update the quantity and price of the existing item
            existingItemLs.quantity += quantity;
            existingItemLs.price = Number(existingItemLs.quantity * price);

            // Replace the existing item in the cart array
            lsProduct = lsProduct.map((currentProduct) => {
              if (currentProduct.id === id) {
                return existingItemLs;
              }
              return currentProduct;
            });
          } else {
            // Add the new item to the cart
            lsProduct.push({ id, quantity, price: Number(quantity * price) });
          }

          // Update local storage and the cart
          localStorage.setItem("cartProductsLS", JSON.stringify(lsProduct));
          updateCart();
        });
      });
    }

    const uniqueCategories = new Set();
    products.forEach((product) => {
      uniqueCategories.add(product.category);
    });

    uniqueCategories.forEach((category) => {
      content += `
                <option value="${category}">${category}</option>
    
    `;
    });
    const product_category = document.querySelector("#category_filter");

    if (product_category) {
      product_category.innerHTML = content;
    }
    updateCart();
  } catch (error) {
    console.error(error);
  }
};
getProduct();
// single product details
