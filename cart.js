import { getCartProductFromLS } from "./getCartProductFromLS.js";
import { updateCart } from "./updateCart.js";

const getCartProduct = async () => {
  try {
    const lsProduct = getCartProductFromLS();
    console.log('Local Storage Products:', lsProduct);

    const res = await axios.get(
      "https://backend-captain-api.vercel.app/api/v1/product/"
    );
    const products = res.data;
    console.log('Fetched Products:', products);

    // Create a map of variations by their ID for quick lookup
    const variationMap = new Map();
    products.forEach((product) => {
      if (Array.isArray(product.variations)) {
        product.variations.forEach((variation) => {
          console.log(`Fetched Variation ID: ${variation._id}`);
          variationMap.set(variation._id, {
            ...variation,
            productName: product.name,
            productCategory: product.category,
            productId: product._id,
          });
        });
      }
    });

    console.log('Variation Map:', variationMap);

    // Filter the local storage items to match the variations
    const filteredVariations = lsProduct.map((item) => {
      console.log('Checking item:', item);
      const matchedVariation = variationMap.get(item.variationId);
      console.log('Matched Variation:', matchedVariation);
      if (matchedVariation) {
        return {
          ...item,
          ...matchedVariation,
        };
      } else {
        console.warn('No matching variation found for item:', item);
        return null;
      }
    }).filter(item => item !== null);

    console.log('Filtered Variations:', filteredVariations);

    let content = "";
    filteredVariations.forEach((item) => {
      content += `
        <tr data-id="${item.productId}" data-variation-id="${item.variationId}">
          <td class="py-4">
            <div class="cart_product flex gap-4">
              <img src="assets/img/samples/product-1-50x50.jpg" alt="">
              <div class="cart_product_details">
                <div class="category text-left">
                  <h3 class="font-bold text-gray-400">${item.productCategory}</h3>
                  <h2 class="font-bold text-gray-800 text-[18px]">${item.productName}</h2>
                  <div class="ratings">3</div>
                </div>
              </div>
            </div>
          </td>
          <td class="py-4">$<span class="cart_basePrice">${item.price}</span></td>
          <td class="py-4"><input type="number" name="quantity" value="${item.quantity}" class="w-14"></td>
          <td class="py-4">$<span class="cart_subtotal">${item.price * item.quantity}</span></td>
          <td class="text-black">
            <p class="cart_item_remove_btn cursor-pointer text-[18px]">x</p>
          </td>
        </tr>
      `;
    });

    console.log('Generated Content:', content);

    const cartItemsElement = document.querySelector("#cart_items");
    if (cartItemsElement) {
      cartItemsElement.innerHTML = content;
    } else {
      console.error('Cart items container not found');
    }

    // Add event listeners for quantity change and removal
    document.querySelectorAll(".cart_item_remove_btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const currentProduct = e.target.closest("tr");
        const productId = currentProduct.getAttribute("data-id").trim();
        const variationId = currentProduct.getAttribute("data-variation-id").trim();

        const updatedProducts = getCartProductFromLS().filter(
          (item) => !(item.id === productId && item.variationId === variationId)
        );

        localStorage.setItem("cartProductsLS", JSON.stringify(updatedProducts));
        updateCart();
        currentProduct.remove();
      });
    });

    document.querySelectorAll("input[name='quantity']").forEach((input) => {
      input.addEventListener("change", (e) => {
        const currentProduct = e.target.closest("tr");
        const productId = currentProduct.getAttribute("data-id").trim();
        const variationId = currentProduct.getAttribute("data-variation-id").trim();
        let newQuantity = Number(e.target.value);

        const existingItem = getCartProductFromLS().find(
          (item) => item.id === productId && item.variationId === variationId
        );

        let basePrice = Number(currentProduct.querySelector(".cart_basePrice").textContent);
        if (existingItem) {
          existingItem.quantity = newQuantity;
          let price = Number((basePrice * newQuantity).toFixed(2));
          existingItem.price = price;

          localStorage.setItem("cartProductsLS", JSON.stringify(getCartProductFromLS()));
          currentProduct.querySelector(".cart_subtotal").textContent = price;
        }
      });
    });
  } catch (error) {
    console.error('Error fetching or processing data:', error);
  }
};

getCartProduct();
updateCart();
