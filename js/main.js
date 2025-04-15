// Main JavaScript functionality
class MainApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollToTop();
        this.setupNavigationHighlight();
        this.setupImagePlaceholders();
        this.addLoadingIndicators();
        this.setupMobileMenu();
    }

    setupScrollToTop() {
        // Create scroll to top button
        const scrollButton = document.createElement('button');
        scrollButton.id = 'scrollToTop';
        scrollButton.className = 'scroll-to-top';
        scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(scrollButton);

        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollButton.classList.add('show');
            } else {
                scrollButton.classList.remove('show');
            }
        });

        // Scroll to top on click
        scrollButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    setupNavigationHighlight() {
        // Highlight current page in navigation
        const currentPage = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && currentPage.includes(href)) {
                link.classList.add('active');
            }
        });
    }

    setupImagePlaceholders() {
        // Add placeholder for missing images
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('error', function() {
                this.src = '../assets/images/placeholder.jpg';
                this.alt = 'Image not available';
            });
        });
    }

    addLoadingIndicators() {
        // Add loading indicators to forms
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', function(e) {
                const submitButton = this.querySelector('button[type="submit"]');
                if (submitButton) {
                    submitButton.disabled = true;
                    submitButton.innerHTML = `
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Loading...
                    `;
                }
            });
        });
    }

    setupMobileMenu() {
        // Close mobile menu when link is clicked
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        const navbarCollapse = document.querySelector('.navbar-collapse');

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navbarCollapse.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                }
            });
        });
    }

    static showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">×</button>
        `;

        document.body.appendChild(notification);

        // Add close button functionality
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            notification.remove();
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    static getNotificationIcon(type) {
        switch (type) {
            case 'success':
                return 'fa-check-circle';
            case 'error':
                return 'fa-exclamation-circle';
            case 'warning':
                return 'fa-exclamation-triangle';
            default:
                return 'fa-info-circle';
        }
    }

    // Utility function to format dates
    static formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Utility function to validate form fields
    static validateFormField(field) {
        const value = field.value.trim();
        const type = field.type;
        const required = field.hasAttribute('required');

        if (required && !value) {
            return {
                valid: false,
                message: 'This field is required'
            };
        }

        switch (type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return {
                    valid: emailRegex.test(value),
                    message: 'Please enter a valid email address'
                };
            case 'tel':
                const phoneRegex = /^\+?[\d\s-]{10,}$/;
                return {
                    valid: value === '' || phoneRegex.test(value),
                    message: 'Please enter a valid phone number'
                };
            default:
                return { valid: true };
        }
    }

    // Utility function to handle API errors
    static handleError(error) {
        console.error('Error:', error);
        this.showNotification(
            error.message || 'An unexpected error occurred. Please try again.',
            'error'
        );
    }
}

// Initialize main app functionality
document.addEventListener('DOMContentLoaded', () => {
    window.mainApp = new MainApp();

    // Add custom styling for invalid form fields
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('invalid', (e) => {
            e.target.classList.add('is-invalid');
        }, true);

        form.addEventListener('input', (e) => {
            if (e.target.classList.contains('is-invalid')) {
                const result = MainApp.validateFormField(e.target);
                if (result.valid) {
                    e.target.classList.remove('is-invalid');
                }
            }
        });
    });
});