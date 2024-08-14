import { updateCart } from "./updateCart.js";

const getSingleProduct = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  try {
    const res = await axios.get(
      `https://backend-captain-api.vercel.app/api/v1/product/${productId}`
    );
    const product = res.data;
    console.log(product);
    
    const productImages = res.data.gallery;
    const productVariations = res.data.variations;

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
      // Create a map to store variations by size and color
      const variationMap = new Map();
      productVariations.forEach((variation) => {
        const key = `${variation.size}-${variation.color}`;
        variationMap.set(key, variation.price);
      });

      // Generate color radio buttons dynamically
      let colorOptions = "";
      const uniqueColors = new Set(productVariations.map(variation => variation.color));

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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                class="h-[10px] w-[10px]"
                fill="currentColor">
                <path
                  d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
              </svg>
            </span>
          </label>
        `;
      });

      document.querySelector(".colors_radio_variation").innerHTML = colorOptions;

      // Generate size options dynamically
      let sizeOptions = "";
      const uniqueSizes = new Set(productVariations.map(variation => variation.size));

      uniqueSizes.forEach((size, index) => {
        sizeOptions += `<option value="${size}">${size}</option>`;
      });
      document.querySelector("#product_size").innerHTML = sizeOptions;

      // Function to update price based on selected size and color
      const updatePrice = () => {
        const selectedColorElement = document.querySelector('input[name="product_color"]:checked');
        const selectedSizeElement = document.querySelector('#product_size');
        
        if (selectedColorElement && selectedSizeElement) {
          const selectedColor = selectedColorElement.value;
          const selectedSize = selectedSizeElement.value;
          const selectedKey = `${selectedSize}-${selectedColor}`;
          const selectedPrice = variationMap.get(selectedKey);
          document.querySelector('#product_price').textContent = selectedPrice ? selectedPrice : product.basePrice;
        } else {
          document.querySelector('#product_price').textContent = product.basePrice;
        }
      };

      // Event listeners to update price when a color or size is selected
      const colorRadios = document.querySelectorAll('input[name="product_color"]');
      colorRadios.forEach((radio) => {
        radio.addEventListener('change', updatePrice);
      });

      document.querySelector('#product_size').addEventListener('change', updatePrice);

      // Set initial price
      updatePrice();
    } else {
      // No variations available, default to base price
      document.querySelector('#product_price').textContent = product.basePrice;
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

  } catch (error) {
    console.error(error);
  }
};

getSingleProduct();
updateCart();
