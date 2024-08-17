import { getCartProductFromLS } from "./getCartProductFromLS.js";
import { updateCart } from "./updateCart.js";

document.addEventListener("DOMContentLoaded", () => {
  let variationMap; // Declare `variationMap` in a higher scope

  const getSingleProduct = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    try {
      const res = await axios.get(
        `https://backend-captain-api.vercel.app/api/v1/product/${productId}`
      );
      const product = res.data;

      const productImages = product.gallery;
      const productVariations = product.variations;
      const basePrice = product.basePrice;

      // Update product images
      let sliderImage = "";
      productImages.forEach((image) => {
        sliderImage += `
          <div class="swiper-slide">
            <img src="${image.url}" />
          </div>
        `;
      });
      document.querySelector(".mySwiper2 .swiper-wrapper").innerHTML = sliderImage;
      document.querySelector(".mySwiperProduct .swiper-wrapper").innerHTML = sliderImage;

      // Update product info
      let content1 = `
        <h4>${product.category}</h4>
        <h2 class="product_title text-[30px] font-bold capitalize">${product.name}</h2>
        <p>${product.description}</p>
        <h3 class="text-[22px] font-bold capitalize">$<span id="product_price">${basePrice || productVariations[0]?.price || ''}</span></h3>
      `;
      document.querySelector(".product_info").innerHTML = content1;

      // Check if variations are null or empty
      const productVariationSection = document.querySelector(".product_variation");
      const product_colors = document.querySelector(".product_colors");
      const product_size = document.querySelector("#product_size");
      if (!productVariations || productVariations.length === 0) {
        // Hide the entire product variation section
        if (productVariationSection) {
          product_colors.style.display = "none";
          product_size.style.display = "none";
        }
      } else {
        // If there are variations, continue to display them
        const colorToSizesMap = new Map();
        variationMap = new Map(); // Initialize `variationMap`

        productVariations.forEach((variation) => {
          const { color, size, price, _id } = variation;

          // Populate colorToSizesMap
          if (!colorToSizesMap.has(color)) {
            colorToSizesMap.set(color, new Set());
          }
          colorToSizesMap.get(color).add(size);

          // Populate variationMap
          const key = `${size}-${color}`;
          variationMap.set(key, { price, _id });
        });

        // Generate color radio buttons
        let colorOptions = "";
        const uniqueColors = new Set(
          productVariations.map((variation) => variation.color)
        );

        uniqueColors.forEach((color, index) => {
          colorOptions += `
            <label for="${color.toLowerCase()}" class="relative">
              <input
                type="radio"
                name="product_color"
                id="${color.toLowerCase()}"
                value="${color}"
                class="peer form-radio h-8 w-8 rounded-none border-none transition-all duration-150 hover:cursor-pointer lg:h-8 lg:w-8"
                ${index === 0 ? "checked" : ""}
                style="background-color: ${color.toLowerCase()};"
              />
              <span
                class="absolute -right-1 -top-1 hidden h-4 w-4 items-center justify-center bg-white peer-checked:inline-flex peer-checked:text-primary dark:bg-gray-900 dark:peer-checked:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-[10px] w-[10px]" fill="currentColor">
                  <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                </svg>
              </span>
            </label>
          `;
        });

        const colorContainer = document.querySelector(".colors_radio_variation");
        if (colorContainer) {
          colorContainer.innerHTML = colorOptions;
        }

        // Function to update size options based on selected color
        const updateSizeOptions = (selectedColor) => {
          const availableSizes = colorToSizesMap.get(selectedColor) || new Set();
          let sizeOptions = "";

          availableSizes.forEach((size) => {
            sizeOptions += `<option value="${size}">${size}</option>`;
          });

          const sizeSelect = document.querySelector("#product_size");
          if (sizeSelect) {
            sizeSelect.innerHTML = sizeOptions;
          }
        };

        // Event listener for color selection
        document.querySelectorAll('input[name="product_color"]').forEach((input) => {
          input.addEventListener("change", (event) => {
            const selectedColor = event.target.value;
            updateSizeOptions(selectedColor);

            // Update the price based on the first available size
            const firstAvailableSize = Array.from(colorToSizesMap.get(selectedColor))[0];
            const selectedKey = `${firstAvailableSize}-${selectedColor}`;
            const { price, _id } = variationMap.get(selectedKey) || { price: basePrice, _id: null };
            document.querySelector("#product_price").textContent = price;

            // Update size dropdown to reflect the first available size
            const sizeSelect = document.querySelector("#product_size");
            if (sizeSelect && sizeSelect.options.length > 0) {
              sizeSelect.value = firstAvailableSize; // Select the first size
            }
          });
        });

        // Event listener for size selection to update price
        const sizeSelectElement = document.querySelector("#product_size");
        if (sizeSelectElement) {
          sizeSelectElement.addEventListener("change", (event) => {
            const selectedColor = document.querySelector('input[name="product_color"]:checked').value;
            const selectedSize = event.target.value;
            const selectedKey = `${selectedSize}-${selectedColor}`;
            const { price, _id } = variationMap.get(selectedKey) || { price: basePrice, _id: null };
            document.querySelector("#product_price").textContent = price;
          });
        }

        // Initialize the size options based on the initially selected color
        const initialColorElement = document.querySelector('input[name="product_color"]:checked');
        if (initialColorElement) {
          const initialColor = initialColorElement.value;
          updateSizeOptions(initialColor);

          // Optionally, update the price based on the first available size for the initially selected color
          const firstAvailableSize = Array.from(colorToSizesMap.get(initialColor))[0];
          const initialKey = `${firstAvailableSize}-${initialColor}`;
          const { price, _id } = variationMap.get(initialKey) || { price: basePrice, _id: null };
          document.querySelector("#product_price").textContent = price;

          // Set the first available size in the dropdown
          const sizeSelect = document.querySelector("#product_size");
          if (sizeSelect) {
            sizeSelect.value = firstAvailableSize;
          }
        } else {
          document.querySelector("#product_price").textContent = basePrice;
        }
      }

      // Add to cart functionality
      const single_product_cart_btn = document.querySelector("#single_product_cart_btn");
      single_product_cart_btn.addEventListener("click", () => {
        console.log(variationMap);
        let lsProduct = getCartProductFromLS();
        const id = product._id;
        let price = Number(document.querySelector("#product_price").textContent);
        let quantity = Number(document.querySelector("input[name='quality']").value);
        const selectedColor = document.querySelector('input[name="product_color"]:checked')?.value;
        const selectedSize = document.querySelector("#product_size")?.value;

        if (basePrice !== null) {
          // Product with basePrice, no variations
          const existingItemLs = lsProduct.find((item) => item.id === id);

          if (existingItemLs) {
            // Update the quantity and price of the existing item
            existingItemLs.quantity += quantity;
            existingItemLs.price = Number(existingItemLs.quantity * price);
          } else {
            // Add the new item to the cart
            lsProduct.push({ id, quantity, price: Number(quantity * price) });
          }
        } else {
          // Product with variations
          const selectedKey = `${selectedSize}-${selectedColor}`;
          console.log("Selected Key:", selectedKey);
          const variation = variationMap.get(selectedKey);
          console.log("Variation Data:", variation);
          const variationId = variation?._id;

          if (variationId) {
            const existingItemLs = lsProduct.find(
              (item) =>
                item.id === id &&
                item.size === selectedSize &&
                item.color === selectedColor
            );

            if (existingItemLs) {
              existingItemLs.quantity += quantity;
              existingItemLs.price = Number(existingItemLs.quantity * price);
            } else {
              lsProduct.push({
                id,
                color: selectedColor,
                size: selectedSize,
                quantity,
                price: Number(quantity * price),
                variationId, // Add the variation ID here
              });
            }
          } else {
            console.error("Variation ID not found for the selected key");
          }
        }

        // Update local storage and the cart
        localStorage.setItem("cartProductsLS", JSON.stringify(lsProduct));
        updateCart();
      });

      // Initialize Swiper
      var swiper = new Swiper(".mySwiperProduct", {
        loop: true,
        spaceBetween: 10,
        slidesPerView: 4,
        freeMode: true,
        watchSlidesProgress: true,
      });
      var swiper2 = new Swiper(".mySwiper2", {
        loop: true,
        spaceBetween: 10,
        navigation: {
          nextEl: ".product_slider-button-next",
          prevEl: ".product_slider-button-prev",
        },
        thumbs: {
          swiper: swiper,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  getSingleProduct();
  updateCart();
});
