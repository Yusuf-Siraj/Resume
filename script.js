/* =====================
   Small Enhancements
   ===================== */
(function() {
    // Year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const root = document.documentElement;

    let manualOverride = false; // tracks temporary toggle

// Update icons based on theme
    function updateIcons() {
        const isLight = root.classList.contains('light');
        document.querySelectorAll('.github-logo').forEach(img => {
            img.src = isLight ? 'github-mark.png' : 'github-mark-white.png';
        });
    }

// Apply system theme (called on load and system changes)
    function applySystemTheme(e) {
        if (!manualOverride) {
            if (e.matches) root.classList.remove('light'); // dark
            else root.classList.add('light'); // light
            updateIcons();
        }
    }

// Detect system preference and listen for changes
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    applySystemTheme(prefersDark); // initial
    prefersDark.addEventListener('change', applySystemTheme);

// Theme toggle button (temporary)
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            root.classList.toggle('light');
            manualOverride = true; // user manually toggled
            updateIcons();
        });
    }

    // Mobile nav
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const open = navMenu.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', String(open));
        });
        // Close when clicking link
        navMenu.querySelectorAll('a').forEach(a =>
            a.addEventListener('click', () => navMenu.classList.remove('open'))
        );
    }

    // Smooth scroll + active link highlight
    const links = document.querySelectorAll('a[href^="#"]');
    const opts = { behavior: 'smooth', block: 'start' };
    links.forEach(link => link.addEventListener('click', e => {
        const id = link.getAttribute('href');
        if (!id || id === '#') return;
        const target = document.querySelector(id);
        if (target) {
            e.preventDefault();
            target.scrollIntoView(opts);
            history.pushState(null, '', id);
        }
    }));

    // Intersection Observer to highlight active section in nav
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const byId = id => Array.from(navLinks).find(a => a.getAttribute('href') === `#${id}`);
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const link = byId(id);
            if (!link) return;
            if (entry.isIntersecting) link.classList.add('active');
            else link.classList.remove('active');
        });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });
    sections.forEach(s => io.observe(s));

    // Contact form -> open email draft
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = encodeURIComponent(form.name.value.trim());
            const email = encodeURIComponent(form.email.value.trim());
            const message = encodeURIComponent(form.message.value.trim());
            // EDIT: change email address
            const to = 'EDIT@email.com';
            const subject = encodeURIComponent(`Portfolio contact from ${name}`);
            const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
            window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
        });
    }
})();

//end