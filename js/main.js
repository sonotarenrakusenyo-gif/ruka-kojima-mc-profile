document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    const backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (backToTop) {
            if (window.scrollY > 400) {
                backToTop.hidden = false;
                backToTop.classList.add('is-visible');
            } else {
                backToTop.classList.remove('is-visible');
                backToTop.hidden = true;
            }
        }
    }, { passive: true });

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    setTimeout(() => {
        document.querySelectorAll('.fade-in:not(.visible)').forEach(el => el.classList.add('visible'));
    }, 2000);

    function getScrollOffset() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return 96;
        return navbar.getBoundingClientRect().height + 24;
    }

    function scrollToTarget(target) {
        closeContactMenu();

        const navbar = document.querySelector('.navbar');
        // Use the compact nav height so the first click lands correctly on desktop.
        navbar?.classList.add('scrolled');

        requestAnimationFrame(() => {
            const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

            const computeTop = () => {
                const offset = getScrollOffset();
                const top = window.scrollY + target.getBoundingClientRect().top - offset;
                return Math.min(Math.max(0, top), maxScroll);
            };

            const isDesktop = window.matchMedia('(min-width: 769px)').matches;
            const behavior = isDesktop ? 'instant' : 'smooth';

            window.scrollTo({ top: computeTop(), behavior });

            const finalize = () => {
                const top = computeTop();
                if (Math.abs(window.scrollY - top) > 2) {
                    window.scrollTo({ top, behavior: 'instant' });
                }
            };

            if (behavior === 'instant') {
                requestAnimationFrame(finalize);
            } else if ('onscrollend' in window) {
                window.addEventListener('scrollend', finalize, { once: true });
            } else {
                window.setTimeout(finalize, 900);
            }
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            scrollToTarget(target);
        });
    });

    if (window.location.hash) {
        const initialTarget = document.querySelector(window.location.hash);
        if (initialTarget) {
            window.setTimeout(() => scrollToTarget(initialTarget), 100);
        }
    }

    // Nav contact dropdown
    const contactBtn = document.getElementById('nav-contact-btn');
    const contactMenu = document.getElementById('nav-contact-menu');

    function closeContactMenu() {
        if (!contactMenu || !contactBtn) return;
        contactMenu.hidden = true;
        contactBtn.setAttribute('aria-expanded', 'false');
    }

    function openContactMenu() {
        if (!contactMenu || !contactBtn) return;
        contactMenu.hidden = false;
        contactBtn.setAttribute('aria-expanded', 'true');
    }

    if (contactBtn && contactMenu) {
        contactBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = contactBtn.getAttribute('aria-expanded') === 'true';
            if (isOpen) closeContactMenu();
            else openContactMenu();
        });

        document.addEventListener('click', (e) => {
            if (!contactMenu.contains(e.target) && !contactBtn.contains(e.target)) {
                closeContactMenu();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeContactMenu();
        });
    }
});
