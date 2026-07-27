/* ═══════════════════════════════════════════
   LUXERION — Enhanced Script Engine
   Smooth animations, parallax, counters
   ═══════════════════════════════════════════ */

// ── Preloader ──
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('hidden');
        // Trigger initial reveals after preloader
        setTimeout(revealElements, 200);
    }, 800);
});

// ── Navbar ──
const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

// Add overlay for mobile menu
const navOverlay = document.createElement('div');
navOverlay.className = 'nav-overlay';
document.body.appendChild(navOverlay);

// Scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    navbar.classList.toggle('scrolled', scrollY > 60);
    lastScroll = scrollY;
}, { passive: true });

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    navOverlay.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
});

navOverlay.addEventListener('click', closeMobileMenu);

function closeMobileMenu() {
    menuToggle.classList.remove('active');
    navLinks.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// ── Smooth Scroll ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = navbar.offsetHeight + 20;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
            closeMobileMenu();
        }
    });
});

// ── Scroll Reveal (Intersection Observer — buttery smooth) ──
function revealElements() {
    const reveals = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = parseInt(el.dataset.delay) || 0;

                setTimeout(() => {
                    el.classList.add('revealed');
                }, delay);

                observer.unobserve(el);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}
revealElements();

// ── Stats Counter ──
const counters = document.querySelectorAll('.counter');
let countersAnimated = false;

function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out curve for smooth deceleration
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);
        el.textContent = current.toLocaleString() + '+';

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = target.toLocaleString() + '+';
        }
    }
    requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
            countersAnimated = true;
            counters.forEach(counter => animateCounter(counter));
        }
    });
}, { threshold: 0.3 });

const statsSection = document.querySelector('.stats');
if (statsSection) statsObserver.observe(statsSection);

// ── Active Nav Link on Scroll ──
const sections = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    const offset = navbar.offsetHeight + 100;

    sections.forEach(section => {
        const top = section.offsetTop - offset;
        if (window.scrollY >= top) {
            current = section.getAttribute('id');
        }
    });

    allNavLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}, { passive: true });

// ── Hero Parallax (GPU-accelerated) ──
const hero = document.querySelector('.hero');
if (hero) {
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                if (scrolled < window.innerHeight) {
                    hero.style.backgroundPositionY = `${50 + scrolled * 0.3}%`;
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// ── Form Handlers ──
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('.btn');
        const originalText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.style.pointerEvents = 'none';

        setTimeout(() => {
            btn.textContent = 'Message Sent!';
            btn.style.background = '#2ecc71';
            contactForm.reset();

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.style.pointerEvents = '';
            }, 2500);
        }, 1200);
    });
}

const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = newsletterForm.querySelector('input');
        const btn = newsletterForm.querySelector('.btn');
        const originalText = btn.textContent;

        btn.textContent = 'Subscribed!';
        btn.style.background = '#2ecc71';
        input.value = '';

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2500);
    });
}

// ── Keyboard Accessibility ──
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
});
