export function initSkipHandler(skipCallback) {
    const skipBtn = document.getElementById('skip-btn');

    setTimeout(() => {
        if (window.innerWidth < 768 && skipBtn) {
            skipBtn.classList.remove('hidden');
        }
    }, 1000);

    if (skipBtn && skipCallback) {
        skipBtn.addEventListener('click', skipCallback);
    }
}

export function initMobileMenu() {
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('close-mobile-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const links = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

    // Move mobile menu to body to ensure fixed positioning works correctly
    // (The navbar has transforms which can break fixed positioning contexts)
    if (mobileMenu && mobileMenu.parentElement !== document.body) {
        document.body.appendChild(mobileMenu);
    }

    function toggleMenu() {
        if (mobileMenu) {
            mobileMenu.classList.toggle('hidden');
            document.body.classList.toggle('overflow-hidden'); // Prevent background scroll
        }
    }

    if (mobileBtn) mobileBtn.addEventListener('click', toggleMenu);
    if (closeBtn) closeBtn.addEventListener('click', toggleMenu);

    // Close menu when a link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                toggleMenu();
            }
        });
    });
}

export function hideLoadingIndicator() {
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.style.opacity = '0';
        setTimeout(() => {
            if (loadingIndicator && loadingIndicator.parentNode) loadingIndicator.remove();
        }, 500);
    }
}
