export function initNavbarScroll() {
    const nav = document.getElementById('main-nav');
    if (!nav) return;

    // Initially check scroll position immediately
    // If already scrolled, show it instantly without animation lag
    if (window.scrollY > 30) {
        nav.classList.add('navbar-visible');
        nav.classList.add('navbar-scrolled');
    }

    const updateNavbar = () => {
        // Show navbar when scrolled down slightly (e.g., 30px)
        if (window.scrollY > 30) {
            nav.classList.add('navbar-visible');
            nav.classList.add('navbar-scrolled');
        } else {
            // Hide navbar when at the very top
            nav.classList.remove('navbar-visible');
            nav.classList.remove('navbar-scrolled');
        }
    };

    // Use rAF to throttle scroll updates for smoother performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateNavbar();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Recompute after images/fonts load and on resize to avoid delayed background appearance
    window.addEventListener('load', updateNavbar);
    window.addEventListener('resize', () => {
        clearTimeout(window.__navResizeTimeout);
        window.__navResizeTimeout = setTimeout(updateNavbar, 150);
    });
} 

export function initScrollObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-animate').forEach(el => observer.observe(el));
}
