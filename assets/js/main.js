import { initThreeJS } from './modules/scene.js';
import { initSkipHandler, initNavbarScroll } from './modules/ui.js';
import { initTheme, toggleTheme } from './modules/theme.js';

document.addEventListener('DOMContentLoaded', () => {
    initTheme();

    // Theme Toggle Listener
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleTheme);
    }
    // Initialize Lucide Icons
    lucide.createIcons();

    // Initialize UI Handlers
    initSkipHandler();
    initNavbarScroll();

    // Start 3D Experience
    initThreeJS();
});
