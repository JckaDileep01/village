import { loadComponent } from './utils/loader.js';
import { initThreeJS } from './scene.js';
import { initTheme, toggleTheme } from './theme.js';
import { initSkipHandler, initMobileMenu, hideLoadingIndicator } from './ui.js';
import { completeIntro, showHomepage } from './welcome.js';
import { initNavbarScroll } from './animations.js';
import { initLanguageSystem } from './translate.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Initialize Theme immediately
    initTheme();

    // 2. Load Components
    console.log('Loading components...');
    try {
        await Promise.all([
            loadComponent('#nav-placeholder', 'src/components/navbar.html'),
            loadComponent('#intro-3d-placeholder', 'src/components/intro-3d.html'),
            loadComponent('#welcome-text-placeholder', 'src/components/welcome-text.html'),
            loadComponent('#hero-placeholder', 'src/components/hero.html'),
            loadComponent('#news-placeholder', 'src/components/news.html'),
            loadComponent('#events-placeholder', 'src/components/events.html'),
            loadComponent('#emergency-alert-placeholder', 'src/components/emergency-alert.html'),
            loadComponent('#quick-info-placeholder', 'src/components/quick-info.html'),
            loadComponent('#location-placeholder', 'src/components/location.html'),
            loadComponent('#gallery-placeholder', 'src/components/gallery.html'),
            loadComponent('#contact-placeholder', 'src/components/contact.html'),
            loadComponent('#footer-placeholder', 'src/components/footer.html')
        ]);
        console.log('Components loaded.');
    } catch (e) {
        console.error('Error loading components:', e);
    }

    // Initialize Translator (must be after navbar is loaded)
    initLanguageSystem();

    // 3. Initialize Logic after DOM is populated //

    // Initialize Lucide Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // Theme Toggle Listener
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleTheme);
    }

    // UI Handlers
    initSkipHandler(completeIntro);
    initMobileMenu();
    initNavbarScroll();

    // Check for skip param or previous session visit
    const urlParams = new URLSearchParams(window.location.search);
    const shouldSkipParam = urlParams.get('skipIntro') === 'true';
    const introShown = sessionStorage.getItem('introShown') === 'true';

    // Check if this is a back/forward navigation
    const isBackForward = window.performance && 
                          window.performance.getEntriesByType && 
                          window.performance.getEntriesByType("navigation").length > 0 && 
                          window.performance.getEntriesByType("navigation")[0].type === 'back_forward';

    if (shouldSkipParam || introShown || isBackForward) {
        // Skip animation: Hide intro and show homepage immediately
        const introContainer = document.getElementById('intro-container');
        if (introContainer) {
            introContainer.style.display = 'none';
        }
        showHomepage();

        // Ensure session storage is set so future visits also skip
        if (!introShown) {
            sessionStorage.setItem('introShown', 'true');
        }

        // Remove query param if present
        if (shouldSkipParam) {
            const newUrl = window.location.pathname + window.location.hash;
            window.history.replaceState(null, '', newUrl);
        }
    } else {
        // Mark intro as shown for this session
        sessionStorage.setItem('introShown', 'true');

        // Start 3D Experience (requires intro-3d-placeholder to be populated)
        initThreeJS();
    }
});
