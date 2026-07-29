/* ═══════════════════════════════════════════
   LUXERION — Enhanced Script Engine
   Smooth animations, parallax, counters
   ═══════════════════════════════════════════ */

// ── Hero Title — Letter by Letter Split ──
const heroTitle = document.getElementById('heroTitle');
if (heroTitle) {
    let charIndex = 0;
    let lineIndex = 0;
    const nodes = Array.from(heroTitle.childNodes);
    heroTitle.innerHTML = '';
    nodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
            node.textContent.split('').forEach(ch => {
                if (ch.trim() === '') {
                    heroTitle.appendChild(document.createTextNode(' '));
                    return;
                }
                const span = document.createElement('span');
                // Doosri line (Every Detail) ke letters golden gradient me
                span.className = 'ch' + (lineIndex > 0 ? ' gold-ch' : '');
                span.style.setProperty('--i', charIndex++);
                span.textContent = ch;
                heroTitle.appendChild(span);
            });
        } else {
            heroTitle.appendChild(node.cloneNode(false));
            lineIndex++;
        }
    });
}

// ── Section Titles — Word by Word Split ──
document.querySelectorAll('.section-title').forEach(title => {
    const words = title.textContent.trim().split(/\s+/);
    title.innerHTML = words
        .map((w, i) => `<span class="word" style="--w:${i}">${w}</span>`)
        .join(' ');
});

const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // Repeat: jab bhi title screen me aaye words animate ho, bahar jaye to reset
        entry.target.classList.toggle('in-view', entry.isIntersecting);
    });
}, { threshold: 0.4 });
document.querySelectorAll('.section-title').forEach(t => titleObserver.observe(t));

// ── Preloader ──
let heroIntroPlayed = false;
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('hidden');
        // Hero title letters ko cinematic entry do
        if (heroTitle) setTimeout(() => {
            heroTitle.classList.add('ready');
            heroIntroPlayed = true;
        }, 150);
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

// Scroll effect + progress bar + scroll/idle state
const scrollProgress = document.getElementById('scrollProgress');
let lastScroll = 0;
let idleTimer;
document.body.classList.add('is-idle');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    navbar.classList.toggle('scrolled', scrollY > 60);
    lastScroll = scrollY;

    // Golden progress bar — kitna page scroll hua
    if (scrollProgress) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        scrollProgress.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + '%';
    }

    // Scroll ho raha hai → scroll-mode animations; rukte hi idle-mode animations
    document.body.classList.add('is-scrolling');
    document.body.classList.remove('is-idle');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
        document.body.classList.remove('is-scrolling');
        document.body.classList.add('is-idle');
    }, 220);
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
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const offset = navbar.offsetHeight + 20;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
            closeMobileMenu();
        }
    });
});

// ── Scroll Reveal (Intersection Observer — buttery smooth, repeatable) ──
function revealElements() {
    const reveals = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const el = entry.target;
            const delay = parseInt(el.dataset.delay) || 0;

            if (entry.isIntersecting) {
                el._revealTimer = setTimeout(() => {
                    el.classList.add('revealed');
                }, delay);
            } else {
                // Bahar gaya to reset — wapas aane par animation dobara chale
                clearTimeout(el._revealTimer);
                el.classList.remove('revealed');
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
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
        } else if (!entry.isIntersecting && countersAnimated) {
            // Section bahar gaya → reset, wapas aane par counters dobara chalenge
            countersAnimated = false;
            counters.forEach(counter => counter.textContent = '0');
        }
    });
}, { threshold: 0.3 });

const statsSection = document.querySelector('.stats');
if (statsSection) statsObserver.observe(statsSection);

// ── Active Nav Link on Scroll ──
const sections = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
    let current = '';
    const offset = navbar.offsetHeight + 120;

    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - offset) {
            current = section.getAttribute('id');
        }
    });

    // Page ke bilkul end pe last section (Contact) active rahe
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10) {
        current = sections[sections.length - 1].getAttribute('id');
    }

    allNavLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
}

let navTicking = false;
window.addEventListener('scroll', () => {
    if (!navTicking) {
        requestAnimationFrame(() => {
            updateActiveNav();
            navTicking = false;
        });
        navTicking = true;
    }
}, { passive: true });
updateActiveNav();

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

    // Hero title bhi repeatable — wapas top pe aao to letters phir se udenge
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!heroTitle || !heroIntroPlayed) return;
            heroTitle.classList.toggle('ready', entry.isIntersecting);
        });
    }, { threshold: 0.2 });
    heroObserver.observe(hero);
}

// ── Scroll Velocity Tilt — scroll ki speed se sections halke se jhukte hain ──
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReducedMotion) {
    const tiltTargets = document.querySelectorAll(
        '.grid, .services-grid, .testimonials-grid, .about-container, .contact-container, .stats-container'
    );
    let tiltLastY = window.scrollY;
    let tilt = 0;

    (function tiltLoop() {
        const y = window.scrollY;
        const velocity = y - tiltLastY;
        tiltLastY = y;
        // Speed jitni zyada, tilt utna zyada (max ±3.5deg)
        const target = Math.max(-3.5, Math.min(3.5, velocity * 0.09));
        tilt += (target - tilt) * 0.1; // smooth lerp

        if (Math.abs(tilt) < 0.005) {
            if (tilt !== 0) {
                tilt = 0;
                tiltTargets.forEach(el => { el.style.transform = ''; });
            }
        } else {
            tiltTargets.forEach(el => { el.style.transform = `skewY(${tilt.toFixed(3)}deg)`; });
        }
        requestAnimationFrame(tiltLoop);
    })();
}

// ── Contact Form → Email (FormSubmit) + WhatsApp ──
const OWNER_EMAIL = 'luxerion.furnish@gmail.com';
const OWNER_WHATSAPP = '919076005939';

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

function showStatus(type, msg) {
    formStatus.className = 'form-status show ' + type;
    formStatus.textContent = msg;
    setTimeout(() => formStatus.classList.remove('show'), 8000);
}

function openWhatsApp(data) {
    const text =
        `🛋️ *New Enquiry — Luxerion Website*%0A%0A` +
        `👤 *Name:* ${encodeURIComponent(data.name)}%0A` +
        `📧 *Email:* ${encodeURIComponent(data.email)}%0A` +
        `📞 *Phone:* ${encodeURIComponent(data.phone)}%0A` +
        `🛠️ *Service:* ${encodeURIComponent(data.service)}%0A` +
        `💬 *Message:* ${encodeURIComponent(data.message)}`;
    window.open(`https://wa.me/${OWNER_WHATSAPP}?text=${text}`, '_blank');
}

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('.btn');
        const originalText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.style.pointerEvents = 'none';

        const data = {
            name: contactForm.name.value.trim(),
            email: contactForm.email.value.trim(),
            phone: contactForm.phone.value.trim(),
            service: contactForm.service.value,
            message: contactForm.message.value.trim()
        };

        try {
            // Send email via FormSubmit (no backend needed)
            const res = await fetch(`https://formsubmit.co/ajax/${OWNER_EMAIL}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    _subject: `🛋️ New Enquiry from ${data.name} — Luxerion Website`,
                    _template: 'table',
                    _captcha: 'false',
                    Name: data.name,
                    Email: data.email,
                    Phone: data.phone,
                    Service: data.service,
                    Message: data.message
                })
            });

            if (!res.ok) throw new Error('Email service error');

            btn.textContent = 'Message Sent! ✓';
            btn.style.background = '#3a8f5d';
            showStatus('success', '✓ Message sent to our email! Opening WhatsApp to confirm...');

            // Also send details on WhatsApp
            setTimeout(() => openWhatsApp(data), 900);
            contactForm.reset();
        } catch (err) {
            // Email failed — fallback to WhatsApp so enquiry is never lost
            btn.textContent = 'Sent via WhatsApp ✓';
            btn.style.background = '#25d366';
            showStatus('success', '✓ Sending your enquiry via WhatsApp...');
            openWhatsApp(data);
            contactForm.reset();
        }

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.style.pointerEvents = '';
        }, 3000);
    });
}

// ── Keyboard Accessibility ──
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
});
