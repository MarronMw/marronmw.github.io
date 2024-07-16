// show/ faq answer
const faq = document.querySelectorAll(".faq");

faq.forEach((faq) => {
  faq.addEventListener("click", () => {
    faq.classList.toggle("open");
    //change icon
    const icon = faq.querySelector("span");
    if (icon.innerText === "add") {
      icon.innerText = "remove";
    } else {
      icon.innerHTML = "add";
    }
  });
});

var swiper = new Swiper(".mySwiper", {
  slidesPerView: 1,
  spaceBetween: 30,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  //when window is 600px

  breakpoints: {
    600: {
      slidesPerView: 2,
    },
  },
});
