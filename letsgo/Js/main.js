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

// on scroll gestures

window.addEventListener('scroll', reveal);

function reveal(){
  var reveals = document.querySelectorAll('.reveal');
  
  for (var i = 0; i < reveals.length; i++){

      var window_height = window.innerHeight;
      var reveal_top = reveals[i].getBoundingClientRect().top;
      var reveal_point  = 150;

      if(reveal_top < window_height - reveal_point){
        reveals[i].classList.add('active');
      }

      else{
        reveals[i].classList.remove('active');
      }


  }



}