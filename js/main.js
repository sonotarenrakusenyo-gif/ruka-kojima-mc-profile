// FormSubmit 用の受信メールアドレス（例: 'your.name@gmail.com'）
// 空のままだと送信時にメールアプリが開き、Instagram DM も案内します
const CONTACT_RECEIVE_EMAIL = 'kojimaruka.oshigotosenyo@gmail.com';

document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));

    // Safety net: reveal anything still hidden after 2s (in case JS / IntersectionObserver fails)
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

    // Contact form
    const contactForm = document.getElementById('inquiry-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            if (!contactForm.checkValidity()) return;
            e.preventDefault();

            const formData = new FormData(contactForm);
            const name = formData.get('お名前') || '';
            const company = formData.get('会社名・団体名') || '';
            const inquiry = formData.get('お問い合わせ種別') || '';
            const message = formData.get('お問い合わせ内容') || '';
            const email = formData.get('email') || '';

            if (CONTACT_RECEIVE_EMAIL) {
                const submitData = new FormData();
                submitData.append('_subject', '【公式サイト】お問い合わせ');
                submitData.append('_template', 'table');
                submitData.append('_captcha', 'false');
                for (const [key, value] of formData.entries()) {
                    if (key !== '_honey') submitData.append(key, value);
                }
                submitData.append('_next', `${window.location.origin}${window.location.pathname}#contact-thanks`);

                try {
                    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(CONTACT_RECEIVE_EMAIL)}`, {
                        method: 'POST',
                        body: submitData,
                        headers: { Accept: 'application/json' }
                    });
                    if (res.ok) {
                        contactForm.reset();
                        window.location.hash = 'contact-thanks';
                        alert('お問い合わせを送信しました。ご連絡ありがとうございます。');
                        return;
                    }
                } catch (err) {
                    console.error(err);
                }
            }

            const subject = encodeURIComponent(`【お問い合わせ】${inquiry} - ${name}`);
            const body = encodeURIComponent(
                `会社名・団体名: ${company}\n` +
                `お名前: ${name}\n` +
                `ふりがな: ${formData.get('ふりがな') || ''}\n` +
                `メール: ${email}\n` +
                `電話: ${formData.get('電話番号') || ''}\n` +
                `種別: ${inquiry}\n\n` +
                `内容:\n${message}`
            );
            if (CONTACT_RECEIVE_EMAIL) {
                window.location.href = `mailto:${CONTACT_RECEIVE_EMAIL}?subject=${subject}&body=${body}`;
            }
            alert('フォーム送信の設定が完了していないため、Instagram DM（@kojima_ruka）またはページ下部の SNS からご連絡ください。');
        });
    }

    if (window.location.hash === '#contact-thanks') {
        const thanks = document.getElementById('contact-thanks');
        if (thanks) thanks.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});
