document.addEventListener("DOMContentLoaded", () => {

  // ======================
  // MENU
  // ======================

  const menuBtn = document.querySelector(".menu-toggle");
  const overlay = document.querySelector(".menu-overlay");
  const closeBtn = document.querySelector(".close-menu");
  const menuPanel = document.querySelector(".menu-panel");

  if (menuBtn && overlay) {
    menuBtn.addEventListener("click", () => {
      overlay.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  }

  function closeMenu() {
    overlay.classList.remove("active");
    document.body.style.overflow = "auto";
  }

  if (closeBtn) closeBtn.addEventListener("click", closeMenu);

  if (overlay && menuPanel) {
    overlay.addEventListener("click", (e) => {
      if (!menuPanel.contains(e.target)) {
        closeMenu();
      }
    });
  }


  // ======================
  // SLIDER
  // ======================

  const track = document.querySelector(".portfolio-track");
const slides = document.querySelectorAll(".portfolio-item");
const nextBtn = document.querySelector(".arrow.right");
const prevBtn = document.querySelector(".arrow.left");

let currentIndex = 1; // pornim pe mijloc

function updateSlider() {
  const slideWidth = slides[0].offsetWidth;
  const containerWidth = document.querySelector(".portfolio").offsetWidth;

  const offset =
    (slideWidth * currentIndex) -
    (containerWidth / 2) +
    (slideWidth / 2);

  track.style.transform = `translateX(-${offset}px)`;
}

function goNext() {
  if (currentIndex < slides.length - 1) {
    currentIndex++;
    updateSlider();
  }
}

function goPrev() {
  if (currentIndex > 0) {
    currentIndex--;
    updateSlider();
  }
}

nextBtn.addEventListener("click", goNext);
prevBtn.addEventListener("click", goPrev);

window.addEventListener("resize", updateSlider);

updateSlider();prevBtn.addEventListener("click", goPrev);

  // Swipe mobile
  let startX = 0;
  let endX = 0;

  track.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });

  track.addEventListener("touchend", e => {
    endX = e.changedTouches[0].clientX;
    handleSwipe();
  });

  function handleSwipe() {
    const threshold = 50;

    if (startX - endX > threshold) {
      goNext();
    }

    if (endX - startX > threshold) {
      goPrev();
    }
  }

  window.addEventListener("resize", updateSlider);

});