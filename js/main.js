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

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                closeContactMenu();
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

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
