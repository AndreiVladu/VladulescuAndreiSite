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

  if (!track || slides.length === 0) return;

  let currentIndex = 0;

  function getSlideWidth() {
    return slides[0].getBoundingClientRect().width;
  }

  function updateSlider() {
    const slideWidth = getSlideWidth();
    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
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

  if (nextBtn) nextBtn.addEventListener("click", goNext);
  if (prevBtn) prevBtn.addEventListener("click", goPrev);

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