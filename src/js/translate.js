
// Manual Bilingual System (English + Telugu)
// No external APIs, No Google Translate

export function initLanguageSystem() {
    // 1. Bind Click Events
    const buttons = document.querySelectorAll('.lang-btn-custom');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = btn.getAttribute('data-lang');
            setLanguage(lang);
        });
    });

    // 2. Load Saved Language
    const savedLang = localStorage.getItem('userLanguage') || 'en';
    setLanguage(savedLang);
}

export function setLanguage(lang) {
    // Validate language
    if (lang !== 'en' && lang !== 'te') return;

    // 1. Update Text Content
    const elements = document.querySelectorAll('[data-en]');
    
    elements.forEach(el => {
        // If the element has the specific language attribute, use it
        // Otherwise fallback to English (or keep existing if desired, but here we switch)
        const text = el.getAttribute(`data-${lang}`);
        
        if (text) {
            el.innerHTML = text;
        }
    });

    // 2. Update Active Button State
    document.querySelectorAll('.lang-btn-custom').forEach(btn => {
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // 3. Persist Preference
    localStorage.setItem('userLanguage', lang);
    
    // 4. Update HTML lang attribute for accessibility
    document.documentElement.lang = lang;
}
