const introContainerId = 'intro-container';
const welcomeIntroScreenId = 'welcome-intro-screen';
const introWelcomeTextId = 'intro-welcome-text';
const homepageContainerId = 'homepage-container';

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
        const el3 = document.getElementById('stage-3');
        if (el3) {
            el3.classList.remove('hidden');
            el3.classList.add('stage-active');
        }
    }
}

export function completeIntro() {
    const introContainer = document.getElementById(introContainerId);
    const welcomeIntroScreen = document.getElementById(welcomeIntroScreenId);

    if (introContainer) {
        introContainer.classList.add('opacity-0');
        setTimeout(() => {
            introContainer.style.display = 'none';

            // Show Welcome Intro Screen
            // if (welcomeIntroScreen) {
            //     welcomeIntroScreen.classList.remove('hidden');
            //     typeWelcomeIntro();
            // } else {
            //     showHomepage();
            // }
            showHomepage(); // Skip welcome intro text
        }, 1000);
    } else {
        showHomepage();
    }
}

function typeWelcomeIntro() {
    const introWelcomeText = document.getElementById(introWelcomeTextId);
    const welcomeIntroScreen = document.getElementById(welcomeIntroScreenId);
    const text = "Welcome to Kareempur Village Portal";

    if (!introWelcomeText) {
        showHomepage();
        return;
    }

    introWelcomeText.textContent = "";
    let i = 0;
    const speed = 100;

    function type() {
        if (i < text.length) {
            introWelcomeText.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
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

    setTimeout(type, 500);
}

export function showHomepage() {
    const homepageContainer = document.getElementById(homepageContainerId);
    if (homepageContainer) {
        homepageContainer.classList.remove('hidden');
        homepageContainer.classList.add('visible'); // Add visible class to trigger display: block
        void homepageContainer.offsetWidth; // Trigger reflow
        homepageContainer.classList.remove('opacity-0');

        // Dynamic import to avoid circular dependencies or import errors
        import('./animations.js').then(module => {
            module.initScrollObserver();
        });
    }
}
