document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     SLIDER PORTOFOLIU
  ========================= */

  const track = document.querySelector(".portfolio-track");
  const items = document.querySelectorAll(".portfolio-item");

  let autoplayInterval = null;
  let sliderPaused = false;
  let isAnimating = false;
  const intervalTime = 5000;

  if (track && items.length) {
    const itemWidth = items[0].offsetWidth + 24;
    let index = 0;

    function moveNext() {
      if (sliderPaused || isAnimating) return;
      isAnimating = true;
      index++;

      track.style.transition =
        "transform 1.6s cubic-bezier(0.22, 0.61, 0.36, 1)";
      track.style.transform = `translateX(-${itemWidth * index}px)`;

      setTimeout(() => {
        track.appendChild(track.firstElementChild);
        track.style.transition = "none";
        track.style.transform = `translateX(-${itemWidth * (index - 1)}px)`;
        index--;
        isAnimating = false;
      }, 1200);
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayInterval = setInterval(moveNext, intervalTime);
    }

    function stopAutoplay() {
      clearInterval(autoplayInterval);
    }

    startAutoplay();

    /* =========================
       VIDEO LOGIC
    ========================= */

    items.forEach(item => {
      const video = item.querySelector("video");
      const fullscreenBtn = item.querySelector(".fullscreen-btn");

      if (!video) return;

      item.addEventListener("click", () => {
        if (video.paused) {
          video.currentTime = 0;
          video.play();
          item.classList.add("playing");
          sliderPaused = true;
          stopAutoplay();
        } else {
          video.pause();
          video.load();
          item.classList.remove("playing");
          sliderPaused = false;
          startAutoplay();
        }
      });

      video.addEventListener("ended", () => {
        video.load();
        item.classList.remove("playing");
        sliderPaused = false;
        startAutoplay();
      });

      if (fullscreenBtn) {
        fullscreenBtn.addEventListener("click", e => {
          e.stopPropagation();
          if (video.requestFullscreen) {
            video.requestFullscreen();
          } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen();
          }
        });
      }
    });
  }

  /* =========================
     MENIU MOBILE (FIX FINAL)
  ========================= */

  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  const menuClose = document.querySelector(".menu-close");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", e => {
      e.stopPropagation();
      mobileMenu.classList.add("open");
      document.body.style.overflow = "hidden";
    });
  }

  if (menuClose && mobileMenu) {
    menuClose.addEventListener("click", e => {
      e.stopPropagation();
      mobileMenu.classList.remove("open");
      document.body.style.overflow = "";
    });
  }

  document.addEventListener("click", e => {
    if (
      mobileMenu &&
      mobileMenu.classList.contains("open") &&
      !mobileMenu.contains(e.target) &&
      !e.target.closest(".menu-toggle")
    ) {
      mobileMenu.classList.remove("open");
      document.body.style.overflow = "";
    }
  });

});
/* ================== PLANET ANIMATION (SAFE) ================== */

const planets = document.querySelectorAll(".planet");

if (planets.length) {
  const planetData = [];

  planets.forEach((planet, index) => {
    planetData.push({
      el: planet,
      x: Math.random() * 20,
      y: Math.random() * 20,
      speedX: 0.02 + Math.random() * 0.02,
      speedY: 0.02 + Math.random() * 0.02,
      dirX: Math.random() > 0.5 ? 1 : -1,
      dirY: Math.random() > 0.5 ? 1 : -1,
    });
  });

  function animatePlanets() {
    planetData.forEach(p => {
      p.x += p.speedX * p.dirX;
      p.y += p.speedY * p.dirY;

      if (Math.abs(p.x) > 20) p.dirX *= -1;
      if (Math.abs(p.y) > 20) p.dirY *= -1;

      p.el.style.transform = `translate(${p.x}px, ${p.y}px)`;
    });

    requestAnimationFrame(animatePlanets);
  }

  animatePlanets();
}