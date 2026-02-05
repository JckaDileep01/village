/**
 * Component Loader utility
 * Fetches HTML content from a given path and injects it into the target selector.
 * @param {string} selector - CSS selector for the target element.
 * @param {string} path - Path to the HTML component file.
 * @param {string} [linkPrefix=''] - Optional prefix to prepend to relative links (e.g., '../../').
 * @returns {Promise<void>}
 */
export async function loadComponent(selector, path, linkPrefix = '') {
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Failed to load component: ${path}`);
        const html = await response.text();
        const element = document.querySelector(selector);
        if (element) {
            element.innerHTML = html;

            // Adjust links if a prefix is provided
            if (linkPrefix) {
                // Fix anchor tags
                const links = element.querySelectorAll('a');
                links.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href && !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
                        // If it's just an anchor like "#home", prepend prefix + "index.html" if needed?
                        // No, we assume navbar.html uses "index.html#home" or "src/pages/..."
                        // So just prepend prefix.
                        link.setAttribute('href', linkPrefix + href);
                    }
                });

                // Fix images
                const images = element.querySelectorAll('img');
                images.forEach(img => {
                    const src = img.getAttribute('src');
                    if (src && !src.startsWith('http') && !src.startsWith('data:')) {
                        img.setAttribute('src', linkPrefix + src);
                    }
                });
            }
        } else {
            console.error(`Target element not found: ${selector}`);
        }
    } catch (error) {
        console.error(error);
    }
}
