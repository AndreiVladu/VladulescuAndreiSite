document.addEventListener('DOMContentLoaded', function() {
    console.log('Despre page loaded');
    
    // === ANIMATII SCROLL ===
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Stagger pentru carduri
                if (entry.target.classList.contains('value-card') || 
                    entry.target.classList.contains('equipment-item')) {
                    const parent = entry.target.parentElement;
                    const siblings = Array.from(parent.children);
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.transitionDelay = (index * 0.1) + 's';
                }
            }
        });
    }, observerOptions);
    
    // Observă elementele
    document.querySelectorAll('.about-image, .about-content, .value-card, .equipment-item').forEach(el => {
        observer.observe(el);
    });
    
    // === PARALLAX SUBTIL PENTRU HERO ===
    const heroImage = document.querySelector('.about-hero-image img');
    if (heroImage) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            heroImage.style.transform = `scale(1.1) translateY(${rate}px)`;
        });
    }
    
    // === HOVER PENTRU IMAGINI ===
    const mainImage = document.querySelector('.about-image-main');
    const secondaryImage = document.querySelector('.about-image-secondary');
    
    if (mainImage && secondaryImage) {
        const imageContainer = document.querySelector('.about-image');
        
        imageContainer.addEventListener('mouseenter', () => {
            mainImage.style.transform = 'scale(1.02)';
            secondaryImage.style.transform = 'translate(10px, -10px)';
        });
        
        imageContainer.addEventListener('mouseleave', () => {
            mainImage.style.transform = 'scale(1)';
            secondaryImage.style.transform = 'translate(0, 0)';
        });
    }
    
    // === SMOOTH SCROLL PENTRU LINK-URI ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});



// === CUSTOM CURSOR ===
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
let mouseX = 0, mouseY = 0;
let outlineX = 0, outlineY = 0;

const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

if (!isTouchDevice) {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });

    function animateCursor() {
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .portfolio-card, .magnetic-btn, .faq-question');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    // Magnetic buttons
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}


// === MOBILE MENU ===
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
}

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});
