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

// === NAVBAR SCROLL ===
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

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

// === SCROLL VELOCITY ===
let lastScrollY = window.scrollY;
let velocity = 0;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    velocity = (currentScrollY - lastScrollY) * 0.1;
    velocity = Math.max(-2, Math.min(2, velocity));
    
    document.querySelectorAll('.card-image img, .hero-image img').forEach(img => {
        img.style.transform = `skewY(${velocity}deg) scale(${1 + Math.abs(velocity) * 0.01})`;
    });
    
    lastScrollY = currentScrollY;
    
    setTimeout(() => {
        document.querySelectorAll('.card-image img, .hero-image img').forEach(img => {
            img.style.transform = '';
        });
    }, 150);
});

// === INTERSECTION OBSERVER ===
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.section-title, .portfolio-card, .process-card, .faq-item').forEach(el => {
    observer.observe(el);
});

// === VIDEO MODAL ===
const modal = document.querySelector('.video-modal');
const modalIframe = document.getElementById('video-iframe');
const modalClose = document.querySelector('.modal-close');
const modalBackdrop = document.querySelector('.modal-backdrop');

function openModal(videoUrl) {
    if (videoUrl) {
        modalIframe.src = videoUrl;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { modalIframe.src = ''; }, 400);
}

document.querySelectorAll('.portfolio-card').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.video));
});

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// === FAQ ACCORDION ===
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        const isActive = item.classList.contains('active');
        
        // Close all
        document.querySelectorAll('.faq-item').forEach(faq => {
            faq.classList.remove('active');
        });
        
        // Open clicked if wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// === PAGE TRANSITIONS ===
document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto') && !href.startsWith('tel')) {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.body.style.opacity = '0';
            setTimeout(() => {
                window.location.href = href;
            }, 300);
        });
    }
});

// === FORM HANDLING ===
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nume = document.getElementById('nume')?.value.trim();
        const telefon = document.getElementById('telefon')?.value.trim();
        
        if (!nume || !telefon) {
            showNotification('Te rugăm să completezi toate câmpurile.', 'error');
            return;
        }
        
        const phoneRegex = /^(\+40|0)[0-9]{9}$/;
        if (!phoneRegex.test(telefon.replace(/\s/g, ''))) {
            showNotification('Te rugăm să introduci un număr de telefon valid.', 'error');
            return;
        }
        
        showNotification('Mesaj trimis cu succes! Te contactez în curând.', 'success');
        contactForm.reset();
    });
}

// === NOTIFICATION ===
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        padding: '1rem 2rem',
        backgroundColor: type === 'success' ? 'var(--gold)' : '#e74c3c',
        color: type === 'success' ? 'var(--text-primary)' : 'white',
        fontFamily: 'var(--font-body)',
        fontSize: '0.9rem',
        borderRadius: '4px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        zIndex: '3000',
        transform: 'translateY(100px)',
        opacity: '0',
        transition: 'all 0.4s var(--transition-cinematic)'
    });
    
    document.body.appendChild(notification);
    requestAnimationFrame(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    });
    
    setTimeout(() => {
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

// === INIT ===
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
    document.body.style.opacity = '1';
});



// === ANIMATIE NUMERE ===
const animateNumbers = () => {
    const numbers = document.querySelectorAll('.stat-number');
    
    numbers.forEach(num => {
        const target = parseInt(num.dataset.target);
        const duration = 2000; // 2 secunde
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateNumber = () => {
            current += step;
            if (current < target) {
                num.textContent = Math.floor(current) + (target === 100 ? '' : '+');
                requestAnimationFrame(updateNumber);
            } else {
                num.textContent = target + (target === 100 ? '%' : '+');
            }
        };
        
        // Pornește când e vizibil
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateNumber();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(num);
    });
};

// === ANIMATIE SCROLL POVESTE ===
const animateStory = () => {
    const storyImage = document.querySelector('.story-image');
    const storyContent = document.querySelector('.story-content');
    
    if (!storyImage || !storyContent) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });
    
    observer.observe(storyImage);
    observer.observe(storyContent);
};

// Inițializează
document.addEventListener('DOMContentLoaded', () => {
    animateNumbers();
    animateStory();
});





document.addEventListener('DOMContentLoaded', function() {
    // === TESTIMONIAL CAROUSEL ===
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.carousel-arrow.prev');
    const nextBtn = document.querySelector('.carousel-arrow.next');
    
    if (!slides.length) return;
    
    let currentSlide = 0;
    let autoPlayInterval;
    const autoPlayDelay = 5000; // 5 secunde
    
    function showSlide(index) {
        // Normalizează index
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        
        currentSlide = index;
        
        // Update slides
        slides.forEach((slide, i) => {
            slide.classList.remove('active', 'prev');
            if (i === currentSlide) {
                slide.classList.add('active');
            } else if (i < currentSlide) {
                slide.classList.add('prev');
            }
        });
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }
    
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    function prevSlide() {
        showSlide(currentSlide - 1);
    }
    
    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
    });
    
    if (prevBtn) prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
    });
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetAutoPlay();
        });
    });
    
    // Auto play
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }
    
    // Pausă la hover
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);
    }
    
    // Start
    showSlide(0);
    startAutoPlay();
});
