
// hamburger animation

import { updateCart } from "./updateCart.js";

const open_btn = document.querySelector(".open_button");
const close_button = document.querySelector(".close_button");

open_btn.addEventListener("click", () => {
  gsap.to(".mobile_nav", {
    x: "0%",
  });
  open_btn.style.display = "none";
  close_button.style.display = "flex";
});
close_button.addEventListener("click", () => {
  gsap.to(".mobile_nav", {
    x: "100%",
  });
  open_btn.style.display = "flex";
  close_button.style.display = "none";
});

// price range
const rangeInput = document.querySelectorAll(".price_range_input input"),
  priceInput = document.querySelectorAll(".price_input input"),
  range = document.querySelector(".price_slider .price_progress");
let priceGap = 1000;

priceInput.forEach((input) => {
  input.addEventListener("input", (e) => {
    let minPrice = parseInt(priceInput[0].value),
      maxPrice = parseInt(priceInput[1].value);

    if (maxPrice - minPrice >= priceGap && maxPrice <= rangeInput[1].max) {
      if (e.target.className === "input-min") {
        rangeInput[0].value = minPrice;
        range.style.left = (minPrice / rangeInput[0].max) * 100 + "%";
      } else {
        rangeInput[1].value = maxPrice;
        range.style.right = 100 - (maxPrice / rangeInput[1].max) * 100 + "%";
      }
    }
  });
});

rangeInput.forEach((input) => {
  input.addEventListener("input", (e) => {
    let minVal = parseInt(rangeInput[0].value),
      maxVal = parseInt(rangeInput[1].value);

    if (maxVal - minVal < priceGap) {
      if (e.target.className === "range_min") {
        rangeInput[0].value = maxVal - priceGap;
      } else {
        rangeInput[1].value = minVal + priceGap;
      }
    } else {
      priceInput[0].value = minVal;
      priceInput[1].value = maxVal;
      range.style.left = (minVal / rangeInput[0].max) * 100 + "%";
      range.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
    }
  });
});

//single product
const tabs = document.querySelectorAll(".tab");
const all_contents = document.querySelectorAll(".content");

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    tabs.forEach((tab) => tab.classList.remove("active"));
    tab.classList.add("active");

    all_contents.forEach((content) => content.classList.remove("active"));
    all_contents[index].classList.add("active");
  });
});

// hero slider
var swiper = new Swiper(".mySwiper", {
  slidesPerView: 1,
  spaceBetween: 30,
  loop: true,

  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    renderBullet: function (index, className) {
      return (
        '<span class="' +
        className +
        ' w-4 h-4 m-0 opacity-100 bg-none bg-transparent">' +
        '<svg class="w-4 h-4" viewBox="0 0 16 16">' +
        '<circle class="path" cx="8" cy="8" r="7" fill="none" transform="rotate(-90 8 8)" stroke="#fff1a5"' +
        'stroke-opacity="1" stroke-width="2px"></circle>' +
        '<circle cx="8" cy="8" r="3" fill="none" stroke-width="2px" stroke="#ffffff"></circle>' +
        "</svg></span>"
      );
    },
  },
  effect: "fade",
  fadeEffect: {
    crossFade: true,
  },
  // autoplay: {
  //   delay: 1000,
  //   disableOnInteraction: false,
  // },
  // navigation: {
  //   nextEl: ".swiper-button-next",
  //   prevEl: ".swiper-button-prev",
  // },
  on: {
    slideChange: function () {
      const currentIndex = this.realIndex;
      const currentSlide = this.slides[currentIndex];
      currentSlide.classList.add("slide-played");
    },
  },
});

// info Slider
var infoswiper = new Swiper(".infoSwiper", {
  slidesPerView: 1,
  spaceBetween: 30,
  loop: true,
  grabCursor: true,

  breakpoints: {
    576: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 2,
    },
    992: {
      slidesPerView: 3,
    },
    1210: {
      slidesPerView: 4,
    },
  },
  // autoplay: {
  //   delay: 1000,
  //   disableOnInteraction: false,
  // },
  navigation: {
    nextEl: ".js-vv-videos-featured-swiper-btn-next",
    prevEl: ".js-vv-videos-featured-swiper-btn-prev",
  },
});

// new_video_swiper
var new_video_swiper = new Swiper(".new_video_swiper", {
  slidesPerView: 1,
  spaceBetween: 30,
  parallax: true,
  speed: 1000,
  loop: true,
  pagination: {
    el: ".new_video-swiper-pagination",
    type: "bullets",
    clickable: true,
    bulletClass: "js-vv-pagination-bullet",
    bulletActiveClass: "js-vv-pagination-bullet-active",
  },
  navigation: {
    nextEl: ".new_video_swiper-button-next",
    prevEl: ".new_video_swiper-button-prev",
  },
});

// // single product product slider
// var single_product_slider = new Swiper(".single_product_slider", {
//   loop: true,
//   navigation: {
//     nextEl: ".product_slider-button-next",
//     prevEl: ".product_slider-button-prev",
//   },
// });

document.addEventListener("DOMContentLoaded", () => {
  const tl = gsap.timeline();

  tl.to(".white_shade", {
    duration: 1,
    x: "0%",
    ease: "power4.in",
    opacity: 1,
    onStart: () => {
      gsap.to(".hero_1_text", { opacity: 0 });
    },
    onComplete: () => {
      gsap.to(".hero_1_text", {
        opacity: 1,
        ease: "ease-in-out",
      });
    },
    stagger: 0.2,
  }).to(".white_shade", {
    duration: 1,
    x: "100%",
    ease: "power4.out",

    onStart: () => {
      gsap.to(".hero_1_text", { opacity: 1, duration: 0.1 });
    },
    stagger: 0.2,
  });
});
//gsap

// let btn = document.querySelector(".hero_section button.custom_btn")

// btn.addEventListener('mouseenter', () => {
//   gsap.to('.white_shade_btn', {
//       duration: 0.2,
//       x: '0%',
//       ease: 'power4.in',
//   });
// });

// btn.addEventListener('mouseleave', () => {
//   gsap.to('.white_shade_btn', {
//       duration: 0.2,
//       x: '100%',
//       ease: 'power4.in',
//       onComplete: () => {
//           // Reset the transform to ensure it starts from the correct position next time
//           gsap.set('.white_shade_btn', { x: '-100%' });
//       }
//   });
// });
updateCart()