'use strict';
const menuButton = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const navbar = document.getElementById('navbar');
menuButton?.addEventListener('click', () => {
  const expanded = mobileMenu.classList.toggle('active');
  menuButton.classList.toggle('active', expanded);
  menuButton.setAttribute('aria-expanded', String(expanded));
  document.body.style.overflow = expanded ? 'hidden' : '';
});
document.querySelectorAll('.mobile-link, .mobile-cta').forEach(a => a.addEventListener('click', () => {
  mobileMenu.classList.remove('active');
  menuButton.classList.remove('active');
  menuButton.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}));
const updateNav = () => navbar?.classList.toggle('scrolled', window.scrollY > 50);
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();
const filters = Array.from(document.querySelectorAll('.pricing-filter'));
const cards = Array.from(document.querySelectorAll('.price-card'));
const names = { nunta: 'Nuntă', botez: 'Botez', majorat: 'Majorat' };
function selectCategory(category) {
  filters.forEach(button => {
    const active = button.dataset.filter === category;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  cards.forEach(card => { card.hidden = card.dataset.category !== category; });
  document.getElementById('category-title').textContent = names[category];
}
filters.forEach(button => button.addEventListener('click', () => selectCategory(button.dataset.filter)));
selectCategory('nunta');
