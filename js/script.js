document.addEventListener("DOMContentLoaded", () => {
    const statNumbers = document.querySelectorAll('[data-count-to]');
    if (!statNumbers.length) return;

    function animateCount(el) {
        const target = parseInt(el.getAttribute('data-count-to'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1600;
        const startTime = performance.now();

        function tick(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);
            el.textContent = current.toLocaleString() + suffix;

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                el.textContent = target.toLocaleString() + suffix;
            }
        }
        requestAnimationFrame(tick);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => observer.observe(el));
});

document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById('testimonials-track');
    const dotsContainer = document.getElementById('testimonials-dots');
    if (!track || !dotsContainer) return;

    const viewport = track.closest('.testimonials-viewport');
    const cards = track.querySelectorAll('.testimonial-card');
    const totalCards = cards.length;

    let cardsPerView = window.innerWidth <= 1000 ? 1 : 3;
    let totalSlides = Math.max(totalCards - cardsPerView + 1, 1);
    let currentIndex = 0;
    let autoSlideTimer = null;
    let touchStartX = 0;

    function buildDots() {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    function updateTrack() {
        const cardWidth = cards[0].getBoundingClientRect().width;
        const gap = 24;
        const offset = currentIndex * (cardWidth + gap);
        track.style.transform = `translateX(-${offset}px)`;

        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
    }

    function goToSlide(index) {
        currentIndex = ((index % totalSlides) + totalSlides) % totalSlides;
        updateTrack();
        resetAutoSlide();
    }

    function nextSlide() { goToSlide(currentIndex + 1); }
    function prevSlide() { goToSlide(currentIndex - 1); }

    function startAutoSlide() {
        stopAutoSlide();
        autoSlideTimer = setInterval(() => {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateTrack();
        }, 3000);
    }

    function kickstartAutoSlide() {
        // Trigger the first advance quickly instead of waiting a full interval
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateTrack();
            startAutoSlide();
        }, 800);
    }

    function stopAutoSlide() {
        if (autoSlideTimer) clearInterval(autoSlideTimer);
    }

    function resetAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }

    function recalc() {
        cardsPerView = window.innerWidth <= 1000 ? 1 : 3;
        totalSlides = Math.max(totalCards - cardsPerView + 1, 1);
        if (currentIndex > totalSlides - 1) currentIndex = totalSlides - 1;
        buildDots();
        updateTrack();
    }

    viewport.addEventListener('mouseenter', stopAutoSlide);
    viewport.addEventListener('mouseleave', startAutoSlide);
    viewport.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        stopAutoSlide();
    }, { passive: true });

    viewport.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 40) {
            if (diff > 0) nextSlide();
            else prevSlide();
        } else {
            startAutoSlide();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
    });

    window.addEventListener('resize', recalc);

    buildDots();
    updateTrack();
    kickstartAutoSlide();
});

document.addEventListener("DOMContentLoaded", () => {
    const tiltWrapper = document.getElementById('demo-tilt');
    const heroSection = document.querySelector('.wago-hero');
    if (!tiltWrapper || !heroSection) return;

    const maxTilt = 8;

    heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width;
        const relY = (e.clientY - rect.top) / rect.height;

        const rotateY = (relX - 0.5) * maxTilt * 2;
        const rotateX = (0.5 - relY) * maxTilt;

        tiltWrapper.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    });

    heroSection.addEventListener('mouseleave', () => {
        tiltWrapper.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const feed = document.getElementById('live-status-feed');
    if (!feed) return;

    const items = feed.querySelectorAll('.live-status-item');
    let current = 0;

    setInterval(() => {
        items[current].classList.remove('active');
        current = (current + 1) % items.length;
        items[current].classList.add('active');
    }, 3200);
});

// --- Mobile Capabilities Slider Auto-Play ---
document.addEventListener("DOMContentLoaded", () => {
    const capGrid = document.querySelector('.capabilities-grid');
    if (!capGrid) return;

    let isMobile = window.innerWidth <= 640;
    let autoScrollInterval;

    function scrollStep() {
        const cardElement = capGrid.querySelector('.capability-card');
        if (!cardElement) return;

        const cardWidth = cardElement.offsetWidth + 16; 

        if (capGrid.scrollLeft + capGrid.clientWidth >= capGrid.scrollWidth - 10) {
            capGrid.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            capGrid.scrollBy({ left: cardWidth, behavior: 'smooth' });
        }
    }

    function startAutoScroll() {
        if (!isMobile) return;
        setTimeout(scrollStep, 1200); // first scroll happens quickly after load
        autoScrollInterval = setInterval(scrollStep, 4000); // then continues at normal pace
    }

    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
    }

    // Check if window is resized between desktop and mobile
    window.addEventListener('resize', () => {
        isMobile = window.innerWidth <= 640;
        stopAutoScroll();
        if (isMobile) {
            startAutoScroll();
        } else {
            capGrid.scrollTo({ left: 0 }); // Reset scroll on desktop
        }
    });

    // Pause auto-scroll when the user touches the slider to swipe manually
    capGrid.addEventListener('touchstart', stopAutoScroll, {passive: true});
    
    // Resume auto-scroll 3 seconds after the user stops touching the screen
    capGrid.addEventListener('touchend', () => {
        setTimeout(startAutoScroll, 3000);
    });

    // Start the loop
    startAutoScroll();
});

// --- Mobile Results Slider (transform-based, reliable) ---
document.addEventListener("DOMContentLoaded", () => {
    const slider = document.querySelector('.mobile-results-slider');
    const track = document.querySelector('.mobile-results-track');
    const slides = document.querySelectorAll('.mobile-results-track .mobile-slide');
    if (!slider || !track || !slides.length) return;

    let isMobile = window.innerWidth <= 1100;
    let currentIndex = 0;
    let autoTimer;

    function render() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        slides.forEach((s, i) => s.classList.toggle('in-view', i === currentIndex));
    }

    function goTo(index) {
        currentIndex = ((index % slides.length) + slides.length) % slides.length;
        render();
    }

    function startAuto() {
        if (!isMobile) return;
        stopAuto();
        setTimeout(() => goTo(currentIndex + 1), 1200); // first slide change happens quickly
        autoTimer = setInterval(() => goTo(currentIndex + 1), 3500); // then continues at normal pace
    }

    function stopAuto() {
        clearInterval(autoTimer);
    }

    let touchStartX = 0;
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        stopAuto();
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 40) {
            if (diff > 0) goTo(currentIndex + 1);
            else goTo(currentIndex - 1);
        }
        setTimeout(startAuto, 3000);
    });

    window.addEventListener('resize', () => {
        isMobile = window.innerWidth <= 1100;
        stopAuto();
        if (isMobile) startAuto();
    });

    render();
    startAuto();
});
document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.getElementById('navHamburger');
    const navLinks = document.querySelector('.nav-links');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
        }
    });
});
// --- Desktop: staggered entrance for stat cards & detail list ---
document.addEventListener("DOMContentLoaded", () => {
    const revealTargets = document.querySelectorAll('.result-stat-card, .detail-item');
    if (!revealTargets.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    revealTargets.forEach(el => observer.observe(el));
});

// --- Transparent to Solid Navbar on Scroll ---
document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.querySelector('.wago-navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        // If scrolled down more than 50 pixels, add the solid background
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            // If back at the top, make it transparent again
            navbar.classList.remove('scrolled');
        }
    });
});