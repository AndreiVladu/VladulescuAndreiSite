document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       MENIU LATERAL ANIMAT
    ========================== */

    const menuToggle = document.querySelector(".menu-toggle");
    const menuOverlay = document.querySelector(".menu-overlay");

    if (menuToggle && menuOverlay) {

        menuToggle.addEventListener("click", () => {
            menuToggle.classList.toggle("active");
            menuOverlay.classList.toggle("active");

            // blocăm scroll doar când meniul e deschis
            if (menuOverlay.classList.contains("active")) {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "auto";
            }
        });

        // închidere la click în afara panoului
        menuOverlay.addEventListener("click", (e) => {
            if (e.target === menuOverlay) {
                closeMenu();
            }
        });

        function closeMenu() {
            menuToggle.classList.remove("active");
            menuOverlay.classList.remove("active");
            document.body.style.overflow = "auto";
        }
    }

    /* =========================
       SLIDER MOBILE (manual)
       FĂRĂ autoplay
    ========================== */

    const track = document.querySelector(".portfolio-track");
    const items = document.querySelectorAll(".portfolio-item");
    const nextBtn = document.querySelector(".arrow.right");
    const prevBtn = document.querySelector(".arrow.left");

    let currentIndex = 0;

    if (track && items.length > 0 && nextBtn && prevBtn) {

        function updateSlider() {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        nextBtn.addEventListener("click", () => {
            if (currentIndex < items.length - 1) {
                currentIndex++;
                updateSlider();
            }
        });

        prevBtn.addEventListener("click", () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        });

        /* =========================
           SWIPE TOUCH
        ========================== */

        let startX = 0;
        let endX = 0;

        track.addEventListener("touchstart", (e) => {
            startX = e.touches[0].clientX;
        });

        track.addEventListener("touchend", (e) => {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
        });

        function handleSwipe() {
            const threshold = 50;

            if (startX - endX > threshold && currentIndex < items.length - 1) {
                currentIndex++;
                updateSlider();
            }

            if (endX - startX > threshold && currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        }
    }

});