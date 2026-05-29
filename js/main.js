// FormSubmit 用の受信メールアドレス（例: 'your.name@gmail.com'）
// 空のままだと送信時にメールアプリが開き、Instagram DM も案内します
const CONTACT_RECEIVE_EMAIL = 'kojimaruka.oshigotosenyo@gmail.com';

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

    // Contact form (FormSubmit → kojimaruka.oshigotosenyo@gmail.com)
    const contactForm = document.getElementById('inquiry-form');
    const submitBtn = contactForm?.querySelector('.form-submit');

    if (contactForm) {
        contactForm.setAttribute('action', `https://formsubmit.co/${encodeURIComponent(CONTACT_RECEIVE_EMAIL)}`);
        contactForm.setAttribute('method', 'POST');

        contactForm.addEventListener('submit', async (e) => {
            if (!contactForm.checkValidity()) return;
            e.preventDefault();

            const formData = new FormData(contactForm);
            const name = formData.get('お名前') || '';
            const company = formData.get('会社名・団体名') || '';
            const inquiry = formData.get('お問い合わせ種別') || '';
            const message = formData.get('お問い合わせ内容') || '';
            const email = formData.get('email') || '';

            if (!CONTACT_RECEIVE_EMAIL) {
                alert('フォーム送信の設定が完了していないため、Instagram DM（@kojima_ruka）またはページ下部の SNS からご連絡ください。');
                return;
            }

            const submitData = new FormData();
            submitData.append('_subject', '【公式サイト】お問い合わせ');
            submitData.append('_template', 'table');
            submitData.append('_captcha', 'false');
            if (email) submitData.append('_replyto', email);
            for (const [key, value] of formData.entries()) {
                if (key !== '_honey') submitData.append(key, value);
            }
            submitData.append('_next', `${window.location.origin}${window.location.pathname}#contact-thanks`);

            const defaultLabel = submitBtn?.textContent || '送信する';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = '送信中…';
            }

            try {
                const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(CONTACT_RECEIVE_EMAIL)}`, {
                    method: 'POST',
                    body: submitData,
                    headers: { Accept: 'application/json' }
                });

                let result = {};
                try {
                    result = await res.json();
                } catch (_) {
                    result = {};
                }

                if (res.ok && result.success !== 'false') {
                    contactForm.reset();
                    window.location.hash = 'contact-thanks';
                    alert('お問い合わせを送信しました。ご連絡ありがとうございます。');
                    return;
                }

                console.error('FormSubmit error', res.status, result);

                if (res.status === 403 || (result.message && /activate|confirm/i.test(result.message))) {
                    alert(
                        '初回設定の確認メールを FormSubmit から kojimaruka.oshigotosenyo@gmail.com にお送りしています。\n\n' +
                        '受信トレイ（迷惑メールフォルダも）を開き、メール内のリンクをクリックして有効化してください。\n' +
                        '有効化後、もう一度フォームから送信してください。'
                    );
                    return;
                }
            } catch (err) {
                console.error(err);
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = defaultLabel;
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

            const useMailFallback = window.confirm(
                'フォームからの自動送信に失敗しました。\nメールアプリで送信しますか？\n\n' +
                '※ 初回のみ FormSubmit から確認メールが届く場合があります。リンクをクリックすると、次回からフォーム送信が届きます。'
            );
            if (useMailFallback) {
                window.location.href = `mailto:${CONTACT_RECEIVE_EMAIL}?subject=${subject}&body=${body}`;
            }
        });
    }

    if (window.location.hash === '#contact-thanks') {
        const thanks = document.getElementById('contact-thanks');
        if (thanks) thanks.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});
