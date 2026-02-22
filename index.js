/* =========================
   CONFIG (OPTIONAL)
   Dacă folosești data-video-id în loc de data-bunny-embed, completezi LIBRARY_ID.
========================= */
const BUNNY_LIBRARY_ID = "595311"; // schimbă dacă e altul la tine

/* =========================
   Helpers: Open / Close (cu aria + scroll lock)
========================= */
function lockScroll(lock) {
  document.documentElement.style.overflow = lock ? "hidden" : "";
  document.body.style.overflow = lock ? "hidden" : "";
}

function openOverlay(overlayEl) {
  overlayEl.style.display = "flex";
  overlayEl.setAttribute("aria-hidden", "false");
  lockScroll(true);
}

function closeOverlay(overlayEl) {
  overlayEl.style.display = "none";
  overlayEl.setAttribute("aria-hidden", "true");
  lockScroll(false);
}

/* =========================
   1) MOBILE MENU (hamburger)
========================= */
const menuToggle = document.querySelector(".menu-toggle");
const menuOverlay = document.querySelector(".menu-overlay");
const menuClose = document.querySelector(".menu-close");
const mobileNavLinks = document.querySelectorAll(".mobile-nav a");

function openMenu() {
  openOverlay(menuOverlay);
  if (menuToggle) menuToggle.setAttribute("aria-expanded", "true");
}

function closeMenu() {
  closeOverlay(menuOverlay);
  if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
}

if (menuToggle && menuOverlay) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuOverlay.getAttribute("aria-hidden") === "false";
    isOpen ? closeMenu() : openMenu();
  });
}

if (menuClose) {
  menuClose.addEventListener("click", closeMenu);
}

/* Închide meniul dacă apeși pe fundalul semi-transparent (nu pe panou) */
if (menuOverlay) {
  menuOverlay.addEventListener("click", (e) => {
    const clickedPanel = e.target.closest(".menu-panel");
    if (!clickedPanel) closeMenu();
  });
}

/* Închide meniul când dai click pe un link (UX normal pe mobil) */
mobileNavLinks.forEach((link) => {
  link.addEventListener("click", () => closeMenu());
});

/* =========================
   2) VIDEO MODAL (Bunny)
========================= */
const videoModal = document.getElementById("videoModal");
const modalPlayer = document.getElementById("modalPlayer");

/* Toate cardurile care deschid video */
const filmButtons = document.querySelectorAll(".film-thumb");

function buildBunnyEmbedUrl(btn) {
  // Varianta 1: ai pus direct URL-ul complet în HTML (data-bunny-embed)
  const direct = btn.getAttribute("data-bunny-embed");
  if (direct) return direct;

  // Varianta 2: ai pus doar video-id (data-video-id), iar noi construim URL-ul
  const videoId = btn.getAttribute("data-video-id");
  if (!videoId) return null;

  return `https://player.mediadelivery.net/embed/${BUNNY_LIBRARY_ID}/${videoId}?autoplay=true`;
}

function openVideoModal(embedUrl) {
  if (!videoModal || !modalPlayer) return;

  // Injectăm iframe doar acum (performanță + nu încarci 6 playere din start)
  const iframe = document.createElement("iframe");
  iframe.src = embedUrl;
  iframe.allow =
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen";
  iframe.allowFullscreen = true;
  iframe.setAttribute("title", "Video player");

  modalPlayer.innerHTML = "";
  modalPlayer.appendChild(iframe);

  videoModal.style.display = "block";
  videoModal.setAttribute("aria-hidden", "false");
  lockScroll(true);
}

function closeVideoModal() {
  if (!videoModal || !modalPlayer) return;

  // Scoatem iframe-ul ca să oprim video complet
  modalPlayer.innerHTML = "";

  videoModal.style.display = "none";
  videoModal.setAttribute("aria-hidden", "true");
  lockScroll(false);
}

/* Click pe thumbnails -> deschide modal */
filmButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const url = buildBunnyEmbedUrl(btn);
    if (!url) return;
    openVideoModal(url);
  });
});

/* Închidere modal: butoane / backdrop */
if (videoModal) {
  videoModal.addEventListener("click", (e) => {
    // în HTML: backdrop și buton close au data-close="true"
    const shouldClose = e.target.matches('[data-close="true"]');
    if (shouldClose) closeVideoModal();
  });
}

/* ESC închide și meniul și modal-ul */
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;

  // Închide modal dacă e deschis
  if (videoModal && videoModal.getAttribute("aria-hidden") === "false") {
    closeVideoModal();
    return;
  }

  // Închide meniu dacă e deschis
  if (menuOverlay && menuOverlay.getAttribute("aria-hidden") === "false") {
    closeMenu();
  }
});

/* =========================
   3) Footer year
========================= */


// ===============================
// EmailJS Contact Form (index.js)
// ===============================

// 1) Init EmailJS (PUNE public key-ul tău aici)
emailjs.init({
  publicKey: "Jyu4Yct8HwIZwfX60" // <- public key-ul tău
});

// 2) Prinde formularul
const form = document.getElementById("contact-form");

// 3) Când dai submit, trimite email
form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Ia valorile din inputuri
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  // Validare simplă (că oamenii trimit orice)
  if (!name || !email || !message) {
    alert("Completează nume, email și mesaj 🙂");
    return;
  }

  // Parametrii pe care îi folosește template-ul din EmailJS
  const templateParams = {
    name: name,
    email: email,
    message: message
  };

  // 4) Trimite email (Service ID + Template ID)
  emailjs
    .send("service_0wraenh", "template_wjipozn", templateParams)
    .then(() => {
      alert("Mesaj trimis ✅");
      form.reset();
    })
    .catch((err) => {
      console.error("EmailJS error:", err);
      alert("Eroare: " + (err?.text || JSON.stringify(err)));
    });
});