export function initTheme() {
    // 1. Check LocalStorage
    const savedTheme = localStorage.getItem('theme');
    const html = document.documentElement;

    if (savedTheme === 'dark') {
        html.classList.add('dark');
    } else if (savedTheme === 'light') {
        html.classList.remove('dark');
    } else {
        // Default to Dark if no preference
        html.classList.add('dark');
    }

    updateButtonState();
}

export function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');

    if (isDark) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }

    updateButtonState();
}

function updateButtonState() {
    // Lucide icons handle the visual switching via 'hidden' classes in HTML
    // so just toggling the 'dark' class on HTML is sufficient.
    console.log('Theme updated:', localStorage.getItem('theme'), 'Dark mode:', document.documentElement.classList.contains('dark'));
}
