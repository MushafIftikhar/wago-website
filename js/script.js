document.addEventListener("DOMContentLoaded", () => {
    const mic = document.getElementById('demo-mic');
    const soundWaves = document.querySelectorAll('.sound-wave');
    const typingText = document.getElementById('typing-text');
    const aiBrain = document.getElementById('ai-brain');
    const progressBar = document.getElementById('demo-progress');
    const extractionLines = document.querySelectorAll('#demo-extraction .extraction-line');
    const reportLines = document.querySelectorAll('#demo-report .hidden-text');

    const textToType = "\"How do I update fall... over 10 feet...\"";

    function runDemoSequence() {
        typingText.innerHTML = "";
        progressBar.style.width = '0%';
        extractionLines.forEach(line => line.classList.remove('visible'));
        reportLines.forEach(line => line.classList.remove('visible'));

        // Step 1: user speaks
        mic.classList.add('listening');
        soundWaves.forEach(wave => wave.classList.add('active'));

        let i = 0;
        let typeInterval = setInterval(() => {
            typingText.innerHTML += textToType.charAt(i);
            i++;
            if (i >= textToType.length) clearInterval(typeInterval);
        }, 50);

        // Step 2: mic stops, docs start flowing into the AI core
        setTimeout(() => {
            mic.classList.remove('listening');
            soundWaves.forEach(wave => wave.classList.remove('active'));
            aiBrain.classList.add('processing');
            progressBar.style.width = '60%';
        }, 2500);

        // Step 3: raw extraction preview appears
        setTimeout(() => {
            progressBar.style.width = '100%';
            extractionLines.forEach((line, index) => {
                setTimeout(() => line.classList.add('visible'), index * 500);
            });
        }, 4200);

        // Step 4: final polished report appears
        setTimeout(() => {
            aiBrain.classList.remove('processing');
            reportLines.forEach((line, index) => {
                setTimeout(() => line.classList.add('visible'), index * 600);
            });
        }, 6800);
    }

    setTimeout(runDemoSequence, 1000);
    setInterval(runDemoSequence, 13000);
});
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
        }, 4500);
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

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
    });

    window.addEventListener('resize', recalc);

    buildDots();
    updateTrack();
    startAutoSlide();
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
document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById('navToggle');
    const links = document.querySelector('.nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('open');
        links.classList.toggle('open');
    });

    links.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('open');
            links.classList.remove('open');
        });
    });
});