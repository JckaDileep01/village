const introContainer = document.getElementById('intro-container');
const homepageContainer = document.getElementById('homepage-container');
const welcomeIntroScreen = document.getElementById('welcome-intro-screen');
const introWelcomeText = document.getElementById('intro-welcome-text');
const skipBtn = document.getElementById('skip-btn');
const loadingIndicator = document.getElementById('loading-indicator');

export function updateStageUI(newStage) {
    document.querySelectorAll('.stage-content').forEach(el => {
        el.classList.remove('stage-active');
        el.classList.add('hidden');
    });

    const activeEl = document.getElementById(`stage-${newStage}`);
    if (activeEl) {
        activeEl.classList.remove('hidden');
        requestAnimationFrame(() => {
            activeEl.classList.add('stage-active');
        });
    } else if (newStage === 3 || newStage === 4) {
        // Keep stage 3 visible during stage 4 (zooming closer)
        const el3 = document.getElementById('stage-3');
        if (el3) {
            el3.classList.remove('hidden');
            el3.classList.add('stage-active');
        }
    }
}

export function completeIntro() {
    if (introContainer) {
        introContainer.classList.add('opacity-0');
        setTimeout(() => {
            introContainer.style.display = 'none';

            // Show Welcome Intro Screen
            if (welcomeIntroScreen) {
                welcomeIntroScreen.classList.remove('hidden');
                typeWelcomeIntro();
            } else {
                showHomepage();
            }
        }, 1000);
    } else {
        showHomepage();
    }
}

function typeWelcomeIntro() {
    const text = "Welcome to Salendri Village Portal";
    if (!introWelcomeText) {
        showHomepage();
        return;
    }

    introWelcomeText.textContent = "";
    let i = 0;
    const speed = 100; // ms per letter

    function type() {
        if (i < text.length) {
            introWelcomeText.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Animation finished, wait then show homepage
            setTimeout(() => {
                welcomeIntroScreen.classList.add('opacity-0');
                welcomeIntroScreen.style.transition = 'opacity 1s ease-out';
                setTimeout(() => {
                    welcomeIntroScreen.classList.add('hidden');
                    showHomepage();
                }, 1000);
            }, 1000);
        }
    }

    // Start typing with a slight delay
    setTimeout(type, 500);
}

function showHomepage() {
    if (homepageContainer) {
        homepageContainer.classList.remove('hidden');
        void homepageContainer.offsetWidth; // Trigger reflow
        homepageContainer.classList.remove('opacity-0');
        initScrollObserver();
    }
}

function initScrollObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-animate').forEach(el => observer.observe(el));
}

// Skip Handler
export function initSkipHandler() {
    setTimeout(() => {
        if (window.innerWidth < 768 && skipBtn) {
            skipBtn.classList.remove('hidden');
        }
    }, 1000);

    if (skipBtn) {
        skipBtn.addEventListener('click', completeIntro);
    }
}


export function hideLoadingIndicator() {
    if (loadingIndicator) {
        loadingIndicator.style.opacity = '0';
        setTimeout(() => {
            if (loadingIndicator && loadingIndicator.parentNode) loadingIndicator.remove();
        }, 500);
    }
}

export function initNavbarScroll() {
    const nav = document.getElementById('main-nav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.remove('bg-transparent');
            nav.classList.add('bg-white/90', 'dark:bg-black/90', 'backdrop-blur-md', 'shadow-lg');
        } else {
            nav.classList.add('bg-transparent');
            nav.classList.remove('bg-white/90', 'dark:bg-black/90', 'backdrop-blur-md', 'shadow-lg');
        }
    });
}
