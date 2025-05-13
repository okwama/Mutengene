// Navbar functionality
document.addEventListener('DOMContentLoaded', () => {
    // Get current page path
    const currentPath = window.location.pathname;
    
    // Find all nav links
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Add active class to current page link
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // Handle mobile menu
    const check = document.getElementById('check');
    const open = document.getElementById('open');
    const close = document.getElementById('close');
    const navList = document.querySelector('.nav-list');

    if (check && open && close && navList) {
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navList.contains(e.target) && !open.contains(e.target) && check.checked) {
                check.checked = false;
            }
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (check.checked) {
                    check.checked = false;
                }
            });
        });
    }
}); 