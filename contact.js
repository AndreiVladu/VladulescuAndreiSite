// ========================================
// MOBILE MENU
// ========================================
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');

mobileMenuBtn.addEventListener('click', function() {
  this.classList.toggle('active');
  mobileMenu.classList.toggle('active');
  document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

mobileLinks.forEach(link => {
  link.addEventListener('click', function() {
    mobileMenuBtn.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// ========================================
// NAVBAR SCROLL
// ========================================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', function() {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// ========================================
// SCROLL REVEAL ANIMATIONS - EXACT CA LA DESPRE
// ========================================
document.addEventListener('DOMContentLoaded', function() {
  
  const scrollElements = document.querySelectorAll('.scroll-hidden');
  
  const elementInView = (el, percentageScroll = 100) => {
    const elementTop = el.getBoundingClientRect().top;
    return (
      elementTop <= 
      ((window.innerHeight || document.documentElement.clientHeight) * (percentageScroll/100))
    );
  };
  
  const displayScrollElement = (element) => {
    element.classList.add('scroll-visible');
  };
  
  const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
      if (elementInView(el, 85)) {
        displayScrollElement(el);
      }
    });
  };
  
  handleScrollAnimation();
  
  window.addEventListener('scroll', handleScrollAnimation, { passive: true });
  
});



// CONFIGURAȚIE - Verifică dacă ID-urile sunt cele din contul tău!
const MAIL_CONFIG = {
    USER_KEY: 'Jyu4Yct8HwIZwfX60', 
    MAIL_SERVICE: 'service_uoi2b9c', 
    MAIL_TEMPLATE: 'template_spi0i5u' 
};

// Inițializare EmailJS
(function() {
    emailjs.init(MAIL_CONFIG.USER_KEY);
})();

// Selectare elemente din HTML
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = submitBtn.querySelector('.btn-text');
const btnLoader = submitBtn.querySelector('.btn-loading'); // Am pus 'btn-loading' conform HTML-ului tău

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Stare de încărcare
    submitBtn.disabled = true;
    if(btnText) btnText.style.display = 'none';
    if(btnLoader) btnLoader.style.display = 'block';

    // Colectare date - Numele variabilelor (stânga) trebuie să fie IDENTICE cu cele din {{ }} de mai sus
    const formData = {
        nume: document.getElementById('nume').value,
        prenume: document.getElementById('prenume').value,
        email: document.getElementById('email').value,
        telefon: document.getElementById('telefon').value,
        data: document.getElementById('data').value,
        locatie: document.getElementById('locatie').value,
        mesaj: document.getElementById('mesaj').value,
        title: "Mesaj Nou Site"
    };

    // Trimitere e-mail
    emailjs.send(MAIL_CONFIG.MAIL_SERVICE, MAIL_CONFIG.MAIL_TEMPLATE, formData)
        .then(function() {
            // SUCCES
            if(btnText) {
                btnText.textContent = 'Mesaj Trimis!';
                btnText.style.display = 'block';
            }
            if(btnLoader) btnLoader.style.display = 'none';
            submitBtn.style.background = '#22c55e'; // Verde succes

            contactForm.reset();

            setTimeout(() => {
                submitBtn.disabled = false;
                if(btnText) btnText.textContent = 'Trimite Mesajul';
                submitBtn.style.background = '';
            }, 3000);

        }, function(error) {
            // EROARE
            console.error('EmailJS Error:', error);
            if(btnText) {
                btnText.textContent = 'Eroare! Reîncearcă';
                btnText.style.display = 'block';
            }
            if(btnLoader) btnLoader.style.display = 'none';
            submitBtn.style.background = '#ef4444'; // Roșu eroare

            setTimeout(() => {
                submitBtn.disabled = false;
                if(btnText) btnText.textContent = 'Trimite Mesajul';
                submitBtn.style.background = '';
            }, 3000);
        });
});


