import { updateCart } from "./updateCart.js";

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
      <h3 class="text-[22px] font-bold capitalize">$<span id="product_price">${product.basePrice}</span></h3>
    `;
    document.querySelector(".product_info").innerHTML = content1;

    if (productVariations && productVariations.length > 0) {
      // Create Maps
      const colorToSizesMap = new Map();
      const variationMap = new Map();
      const basePrice = product.basePrice;

      productVariations.forEach((variation) => {
        const { color, size, price } = variation;

        // Populate colorToSizesMap
        if (!colorToSizesMap.has(color)) {
          colorToSizesMap.set(color, new Set());
        }
        colorToSizesMap.get(color).add(size);

        // Populate variationMap
        const key = `${size}-${color}`;
        variationMap.set(key, price);
      });

      // Generate color radio buttons
      let colorOptions = "";
      const uniqueColors = new Set(productVariations.map((variation) => variation.color));

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

      document.querySelector(".colors_radio_variation").innerHTML = colorOptions;

      // Function to update size options based on selected color
      const updateSizeOptions = (selectedColor) => {
        const availableSizes = colorToSizesMap.get(selectedColor) || new Set();
        let sizeOptions = "";

        availableSizes.forEach((size) => {
          sizeOptions += `<option value="${size}">${size}</option>`;
        });

        document.querySelector("#product_size").innerHTML = sizeOptions;
      };

      // Event listener for color selection
      document.querySelectorAll('input[name="product_color"]').forEach((input) => {
        input.addEventListener('change', (event) => {
          const selectedColor = event.target.value;
          updateSizeOptions(selectedColor);

          // Update the price based on the first available size
          const firstAvailableSize = Array.from(colorToSizesMap.get(selectedColor))[0];
          const selectedKey = `${firstAvailableSize}-${selectedColor}`;
          const selectedPrice = variationMap.get(selectedKey) || basePrice;
          document.querySelector("#product_price").textContent = selectedPrice;

          // Update size dropdown to reflect the first available size
          const sizeSelect = document.querySelector("#product_size");
          if (sizeSelect.options.length > 0) {
            sizeSelect.value = firstAvailableSize; // Select the first size
          }
        });
      });

      // Event listener for size selection to update price
      document.querySelector("#product_size").addEventListener('change', (event) => {
        const selectedColor = document.querySelector('input[name="product_color"]:checked').value;
        const selectedSize = event.target.value;
        const selectedKey = `${selectedSize}-${selectedColor}`;
        const selectedPrice = variationMap.get(selectedKey) || basePrice;
        document.querySelector("#product_price").textContent = selectedPrice;
      });

      // Initialize the size options based on the initially selected color
      const initialColorElement = document.querySelector('input[name="product_color"]:checked');

      if (initialColorElement) {
        const initialColor = initialColorElement.value;
        updateSizeOptions(initialColor);

        // Optionally, update the price based on the first available size for the initially selected color
        const firstAvailableSize = Array.from(colorToSizesMap.get(initialColor))[0];
        const initialKey = `${firstAvailableSize}-${initialColor}`;
        const initialPrice = variationMap.get(initialKey) || basePrice;
        document.querySelector("#product_price").textContent = initialPrice;

        // Set the first available size in the dropdown
        document.querySelector("#product_size").value = firstAvailableSize;
      } else {
        document.querySelector("#product_price").textContent = basePrice;
      }

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
    }
  } catch (error) {
    console.error(error);
  }
};

getSingleProduct();
updateCart();
