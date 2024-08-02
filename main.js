import "./style.css";

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
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  on: {
    slideChange: function () {
      const currentIndex = this.realIndex;
      const currentSlide = this.slides[currentIndex];
      currentSlide.classList.add('slide-played');
    }
  },
});
