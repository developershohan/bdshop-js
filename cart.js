// Now you can use axios in your module

import { getCartProductFromLS } from "./getCartProductFromLS.js";
import { updateCart } from "./updateCart.js";

const getCartProduct = async () => {
  try {
    const lsProduct = getCartProductFromLS();

    const res = await axios.get(
      "https://backend-captain-api.vercel.app/api/v1/product/"
    );
    const products = res.data;

    const filtedProduct = products.filter((product) => {
      return lsProduct.some((item) => item.id === product._id);
    });

    let content = "";
    filtedProduct.map((product) => {
      const existingItemLs = lsProduct.find((item) => item.id === product._id);

      content += `
                        <tr data-id="${product._id}">
                  <td class="py-4">
                    <div class="cart_product flex gap-4">
                      <img src="assets/img/samples/product-1-50x50.jpg" alt="">
                      <div class="cart_product_details">
                        <div class="category text-left">
                          <h3 class=" font-bold text-gray-400"> ${product.category} </h3>
                          <h2 class=" font-bold text-gray-800 text-[18px]">${product.name}</h2>
                          <div class="ratings">
                            3
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="py-4"> $<span id= "cart_basePrice"> ${product.basePrice} </span></td>
                  <td class="py-4"> <input type="number" name="quantity" id="" value="${existingItemLs.quantity}" class="w-14"></td>
                  <td class="py-4"> $<span id= "cart_subtotal">${existingItemLs.price}</span></td>
                  <td class="  text-black  ">
                    <p id="cart_item_remove_btn" class=" cursor-pointer text-[18px]">x</p>
                  </td>
                </tr>
        `;
    });
    document.querySelector("#cart_items").innerHTML = content;

    // cart remove btn
    const cart_item_remove_btn = document.querySelectorAll(
      "#cart_item_remove_btn"
    );
    cart_item_remove_btn.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const currentProduct = e.target.closest("tr");
        const productId = currentProduct.getAttribute("data-id").trim();
        console.log(productId);
        const remainProducts = lsProduct.filter(
          (item) => item.id !== productId
        );
        console.log(remainProducts);

        localStorage.setItem("cartProductsLS", JSON.stringify(remainProducts));
        updateCart();
        currentProduct.remove();
      });
    });

    // update cart
    const quantity = document.querySelectorAll("input[name='quantity']");
    quantity.forEach((quantity) => {
      quantity.addEventListener("change", (e) => {
        const currentProduct = e.target.closest("tr");
        console.log(currentProduct);

        const productId = currentProduct.getAttribute("data-id").trim();
        let newQuantity = Number(e.target.value);

        const existingProduct = lsProduct.find((item) => item.id === productId);
        let price = Number(
          currentProduct.querySelector("#cart_basePrice").textContent
        );

existingProduct.quantity = newQuantity;

        price = existingProduct.price = Number((price * newQuantity).toFixed(2));

        localStorage.setItem("cartProductsLS", JSON.stringify(lsProduct));
        currentProduct.querySelector("#cart_subtotal").textContent = price;
      });

    });
  } catch (error) {
    console.log(error);
  }
};

getCartProduct();
updateCart();
