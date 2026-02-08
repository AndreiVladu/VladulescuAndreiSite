/* ======================================================
   VARIABILE GLOBALE
====================================================== */

const isMobile = window.matchMedia("(max-width: 900px)").matches;

let autoplayInterval = null;
let userInteracted = false;


/* ======================================================
   1. MENIU ☰ (DESKTOP + MOBILE)
====================================================== */

function initMenu() {
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  const menuClose = document.querySelector(".menu-close");

  if (!menuToggle || !mobileMenu || !menuClose) return;

  menuToggle.addEventListener("click", () => {
    mobileMenu.classList.add("open");
    document.body.style.overflow = "hidden";
  });

  menuClose.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    document.body.style.overflow = "";
  });

  mobileMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      document.body.style.overflow = "";
    });
  });
}


/* ======================================================
   2. PORTOFOLIU SLIDER (DESKTOP + MOBILE)
====================================================== */

function initPortfolioSlider() {
  const track = document.querySelector(".portfolio-track");
  const items = document.querySelectorAll(".video-item");
  const arrowLeft = document.querySelector(".slider-arrow.left");
  const arrowRight = document.querySelector(".slider-arrow.right");

  if (!track || items.length === 0) return;

  let index = 0;
  const total = items.length;

  const itemWidth = items[0].offsetWidth + 30; // card + gap

  function updateSlider() {
    track.style.transform = `translateX(-${index * itemWidth}px)`;

    // active clip (desktop)
    items.forEach(item => item.classList.remove("active"));
    if (!isMobile && items[index + 1]) {
      items[index + 1].classList.add("active");
    }
  }

  function nextSlide() {
    if (userInteracted) return;

    index++;
    if (index > total - (isMobile ? 1 : 3)) {
      index = 0;
    }
    updateSlider();
  }

  function prevSlide() {
    index--;
    if (index < 0) {
      index = total - (isMobile ? 1 : 3);
    }
    updateSlider();
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(
      nextSlide,
      isMobile ? 5000 : 3000
    );
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  // autoplay pornește
  startAutoplay();

  // hover desktop = pauză
  if (!isMobile) {
    track.addEventListener("mouseenter", () => stopAutoplay());
    track.addEventListener("mouseleave", () => {
      if (!userInteracted) startAutoplay();
    });
  }

  // săgeți mobile
  if (arrowLeft && arrowRight) {
    arrowLeft.addEventListener("click", () => {
      userInteracted = true;
      stopAutoplay();
      prevSlide();
    });

    arrowRight.addEventListener("click", () => {
      userInteracted = true;
      stopAutoplay();
      nextSlide();
    });
  }

  // click pe item = user interaction
  items.forEach(item => {
    item.addEventListener("click", () => {
      userInteracted = true;
      stopAutoplay();
    });
  });

  updateSlider();
}


/* ======================================================
   3. VIDEO OVERLAY FULLSCREEN
====================================================== */

function initVideoOverlay() {
  const overlay = document.querySelector(".video-overlay");
  const wrapper = document.querySelector(".overlay-video-wrapper");
  const closeBtn = document.querySelector(".overlay-close");
  const prevBtn = document.querySelector(".overlay-arrow.left");
  const nextBtn = document.querySelector(".overlay-arrow.right");
  const items = document.querySelectorAll(".video-item");

  if (!overlay || !wrapper || items.length === 0) return;

  let currentIndex = 0;

  function openOverlay(index) {
    currentIndex = index;
    const videoSrc = items[index].dataset.video;

    wrapper.innerHTML = `
      <iframe 
        src="${videoSrc}?autoplay=1&mute=1&playsinline=1"
        frameborder="0"
        allow="autoplay; fullscreen"
        allowfullscreen>
      </iframe>
    `;

    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeOverlay() {
    overlay.classList.remove("open");
    wrapper.innerHTML = "";
    document.body.style.overflow = "";
  }

  function nextVideo() {
    currentIndex = (currentIndex + 1) % items.length;
    openOverlay(currentIndex);
  }

  function prevVideo() {
    currentIndex =
      (currentIndex - 1 + items.length) % items.length;
    openOverlay(currentIndex);
  }

  items.forEach((item, index) => {
    item.addEventListener("click", () => openOverlay(index));
  });

  closeBtn.addEventListener("click", closeOverlay);
  nextBtn.addEventListener("click", nextVideo);
  prevBtn.addEventListener("click", prevVideo);

  overlay.addEventListener("click", e => {
    if (e.target === overlay) closeOverlay();
  });

  document.addEventListener("keydown", e => {
    if (!overlay.classList.contains("open")) return;

    if (e.key === "Escape") closeOverlay();
    if (e.key === "ArrowRight") nextVideo();
    if (e.key === "ArrowLeft") prevVideo();
  });
}


/* ======================================================
   INIT ALL
====================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initMenu();
  initPortfolioSlider();
  initVideoOverlay();
});