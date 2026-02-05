/**
 * Navigation Utility
 * Handles link adjustments for pages located in subdirectories (e.g., src/pages/)
 * to ensure they correctly point to root resources and other pages.
 */

export function setupNavigation() {
    const path = window.location.pathname;
    // Check if we are in a subpage (inside src/pages)
    const isSubPage = path.includes('/src/pages/');

    // If we are on the main index.html (not in src/pages), we generally don't need to rewrite
    // UNLESS we want to highlight active links or do other logic.
    // For now, only fix links if we are in a subpage.
    if (!isSubPage) return;

    const links = document.querySelectorAll('a');
    const currentPage = path.split('/').pop();

    links.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;

        // 1. Handle Anchor Links (#section)
        // These are assumed to be sections on the homepage (index.html)
        if (href.startsWith('#')) {
            if (href === '#') return; // Ignore empty anchors

            if (href === '#home') {
                // "Home" usually implies the root page
                link.setAttribute('href', '../../index.html?skipIntro=true');
            } else {
                // Other sections -> point to index.html#section (with skip param)
                // Note: Query param must come before hash
                link.setAttribute('href', '../../index.html?skipIntro=true' + href);
            }
        }
        
        // 2. Handle links pointing to Pages (src/pages/...)
        // Since we are ALREADY in src/pages/, we need to adjust the path.
        // Example: src/pages/gram-panchayat.html -> ./gram-panchayat.html
        else if (href.includes('src/pages/')) {
            const targetPage = href.split('/').pop(); // e.g. "gram-panchayat.html"

            if (targetPage === currentPage) {
                // If link points to current page, make it active and prevent reload
                link.setAttribute('href', '#');
                link.classList.add('active'); // Add active class for styling
            } else {
                // Point to sibling file in the same directory
                link.setAttribute('href', targetPage);
            }
        }
        
        // 3. Handle explicit links to index.html
        else if (href === 'index.html' || href === './index.html' || href === '/') {
            link.setAttribute('href', '../../index.html?skipIntro=true');
        }
    });
}
