// ============================================
// ANDREI VLADULESCU — PREȚURI (JS)
// ============================================

// ----- Anul curent în footer -----
document.getElementById('currentYear').textContent = new Date().getFullYear();

// ----- Navbar: fundal la scroll -----
const navbar = document.getElementById('navbar');
const handleScroll = () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
};
window.addEventListener('scroll', handleScroll);
handleScroll();

// ----- Meniu mobil -----
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

mobileMenuBtn.addEventListener('click', () => {
  mobileMenuBtn.classList.toggle('active');
  mobileMenu.classList.toggle('active');
  document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

// Închide meniul la click pe un link
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenuBtn.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// ----- Tab-uri Nuntă / Botez -----
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// ----- Comutator valută EUR / RON -----
const currencyButtons = document.querySelectorAll('.currency-btn');
const priceAmounts = document.querySelectorAll('.price-amount');

currencyButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    currencyButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const currency = btn.dataset.currency; // 'eur' sau 'ron'

    priceAmounts.forEach(amount => {
      amount.style.opacity = '0';
      setTimeout(() => {
        amount.textContent = amount.dataset[currency];
        amount.nextElementSibling.textContent = currency === 'eur' ? '€' : 'lei';
        amount.style.opacity = '1';
      }, 200);
    });
  });
});

// ----- Animație simplă la apariția cardurilor -----
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.price-card').forEach((card, i) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = `opacity 0.6s ease ${i * 0.12}s, transform 0.6s ease ${i * 0.12}s`;
  observer.observe(card);
});
