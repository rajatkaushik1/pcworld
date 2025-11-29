// =====================================
// PC WORLD - Main Script
// =====================================

document.addEventListener("DOMContentLoaded", () => {
    initMobileNav();
    initSmoothScroll();
    initActiveNavOnScroll();
    initScrollTopButton();
    initReviewsMarquee();
    initScrollAnimations();
    initStatCounters();
    initContactForm();
});

// =======================
// Mobile Navigation
// =======================
function initMobileNav() {
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("navLinks");
    const navItems = document.querySelectorAll(".nav-link");

    if (!hamburger || !navLinks) return;

    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navLinks.classList.toggle("active");
    });

    navItems.forEach(link => {
        link.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navLinks.classList.remove("active");
        });
    });

    // Close menu when clicking outside (mobile)
    document.addEventListener("click", e => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove("active");
            navLinks.classList.remove("active");
        }
    });

    // Close on Escape
    document.addEventListener("keydown", e => {
        if (e.key === "Escape") {
            hamburger.classList.remove("active");
            navLinks.classList.remove("active");
        }
    });
}

// =======================
// Smooth Scroll
// =======================
function initSmoothScroll() {
    const header = document.getElementById("header");
    const headerHeight = header ? header.offsetHeight : 0;

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", e => {
            const href = link.getAttribute("href");
            if (!href || href === "#" || href.length < 2) return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            const targetTop = target.getBoundingClientRect().top + window.scrollY;
            const offset = targetTop - headerHeight - 10;

            window.scrollTo({
                top: offset < 0 ? 0 : offset,
                behavior: "smooth"
            });
        });
    });
}

// =======================
// Active Nav on Scroll
// =======================
function initActiveNavOnScroll() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");
    if (!sections.length || !navLinks.length) return;

    const header = document.getElementById("header");
    const getHeaderH = () => (header ? header.offsetHeight : 0);

    window.addEventListener("scroll", () => {
        const scrollY = window.scrollY;
        const headerH = getHeaderH();

        let currentId = "";

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const top = rect.top + window.scrollY - headerH - 80;
            const bottom = top + section.offsetHeight;

            if (scrollY >= top && scrollY < bottom) {
                currentId = section.id;
            }
        });

        navLinks.forEach(link => {
            const href = link.getAttribute("href");
            if (!href || href[0] !== "#") return;

            if (href.slice(1) === currentId) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    });
}

// =======================
// Scroll To Top Button
// =======================
function initScrollTopButton() {
    const btn = document.getElementById("scrollTopBtn");
    if (!btn) return;

    window.addEventListener("scroll", () => {
        if (window.scrollY > 400) {
            btn.classList.add("visible");
        } else {
            btn.classList.remove("visible");
        }
    });

    btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

// =======================
// Reviews Marquee (infinite scroll)
// =======================
function initReviewsMarquee() {
    const track = document.getElementById("reviewsTrack");
    if (!track) return;

    const cards = Array.from(track.children);
    if (!cards.length) return;

    // Clone the existing cards once to create a seamless loop
    const fragment = document.createDocumentFragment();
    cards.forEach(card => {
        fragment.appendChild(card.cloneNode(true));
    });
    track.appendChild(fragment);

    // Pause animation on touch for mobile (hover already handled by CSS)
    track.addEventListener(
        "touchstart",
        () => {
            track.style.animationPlayState = "paused";
        },
        { passive: true }
    );

    track.addEventListener(
        "touchend",
        () => {
            track.style.animationPlayState = "running";
        },
        { passive: true }
    );
}

// =======================
// Contact Form
// =======================
function initContactForm() {
    const form = document.getElementById("contactForm");
    const submitBtn = document.getElementById("contactSubmit");
    const statusEl = document.getElementById("formStatus");

    if (!form || !submitBtn || !statusEl) return;

    form.addEventListener("submit", e => {
        e.preventDefault();

        const name = form.name.value.trim();
        const phone = form.phone.value.trim();
        const service = form.service.value.trim();
        const message = form.message.value.trim();

        // ---- Validation ----
        if (name.length < 2) {
            setFormStatus("Please enter a valid name.", "error", statusEl);
            form.name.focus();
            return;
        }

        const digitsOnly = phone.replace(/\D/g, "");
        if (digitsOnly.length < 10 || digitsOnly.length > 13) {
            setFormStatus("Please enter a valid mobile number.", "error", statusEl);
            form.phone.focus();
            return;
        }

        if (!service) {
            setFormStatus("Please select the service you need.", "error", statusEl);
            form.service.focus();
            return;
        }

        if (message.length < 10) {
            setFormStatus("Please describe your issue (at least 10 characters).", "error", statusEl);
            form.message.focus();
            return;
        }

        // ---- Simulated submission (front‑end only) ----
        const originalHtml = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending...';
        setFormStatus("Sending your message...", "info", statusEl);

        // Simulate server delay
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHtml;
            form.reset();
            setFormStatus("Thank you! We will contact you shortly.", "success", statusEl);
        }, 1200);
    });
}

// =======================
// Scroll-based Reveal Animations
// =======================
function initScrollAnimations() {
    const elements = document.querySelectorAll(".scroll-animate");
    if (!elements.length) return;

    // Mark that scroll animations are enabled so CSS can switch 
    // from the static state to the animated state.
    document.documentElement.classList.add("has-scroll-animations");

    // Respect users who prefer reduced motion
    const prefersReducedMotion =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // If motion is reduced or IntersectionObserver is not available,
    // just show all elements immediately.
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        elements.forEach(el => {
            el.classList.add("in-view");
        });
        return;
    }

    // Optional stagger: read data-anim-delay from each element (e.g. "0.15s")
    elements.forEach(el => {
        const delay = el.dataset.animDelay;
        if (delay) {
            el.style.transitionDelay = delay;
        }
    });

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                    // Reveal each element only once
                    obs.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.2,
            rootMargin: "0px 0px -10% 0px"
        }
    );

    elements.forEach(el => observer.observe(el));
}

// =======================
// Stat Counters (count up on scroll)
// =======================
function initStatCounters() {
    const counters = document.querySelectorAll(".stat-number[data-target]");
    if (!counters.length) return;

    const prefersReducedMotion =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Format number with thousands separators and optional decimals/suffix
    const formatValue = (value, decimals, suffix) => {
        const fixed = value.toFixed(decimals);
        const parts = fixed.split(".");
        const intPart = parts[0];
        const decimalPart = parts[1];

        const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        if (decimals > 0 && typeof decimalPart === "string") {
            return withCommas + "." + decimalPart + (suffix || "");
        }

        return withCommas + (suffix || "");
    };

    const animateCounter = el => {
        const target = parseFloat(el.dataset.target);
        if (isNaN(target)) return;

        const duration = parseInt(el.dataset.duration, 10) || 1600; // ms
        const decimals = parseInt(el.dataset.decimals, 10) || 0;
        const suffix = el.dataset.suffix || "";

        const start = 0;
        const startTime = performance.now();

        const step = now => {
            const progress = Math.min((now - startTime) / duration, 1);
            const current = start + (target - start) * progress;
            el.textContent = formatValue(current, decimals, suffix);

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
    };

    const setFinalValuesImmediately = () => {
        counters.forEach(el => {
            const target = parseFloat(el.dataset.target);
            if (isNaN(target)) return;

            const decimals = parseInt(el.dataset.decimals, 10) || 0;
            const suffix = el.dataset.suffix || "";
            el.textContent = formatValue(target, decimals, suffix);
        });
    };

    // If reduced motion is preferred, or IntersectionObserver is missing,
    // simply set the final values without animation.
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        setFinalValuesImmediately();
        return;
    }

    const container = document.querySelector(".about-stats");
    if (!container) {
        setFinalValuesImmediately();
        return;
    }

    let hasAnimated = false;

    const runAnimation = () => {
        if (hasAnimated) return;
        hasAnimated = true;

        counters.forEach(el => animateCounter(el));
    };

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    runAnimation();
                    obs.disconnect();
                }
            });
        },
        {
            threshold: 0.3
        }
    );

    observer.observe(container);
}

// helper for status
function setFormStatus(message, type, el) {
    if (!el) return;
    el.textContent = message;

    // Reset styles
    el.style.color = "";
    el.style.fontWeight = "500";

    if (type === "success") {
        el.style.color = "#16a34a"; // green
    } else if (type === "error") {
        el.style.color = "#dc2626"; // red
    } else {
        el.style.color = "#64748b"; // neutral
    }
}

// =======================
// Console Info
// =======================
console.log(
    "%cPC WORLD - Aligarh",
    "background:#2563eb;color:#fff;padding:4px 10px;border-radius:4px;font-weight:bold;"
);
console.log("Laptop repair, PC building & used computers since 2005.");
console.log("Contact: 092580 50307");