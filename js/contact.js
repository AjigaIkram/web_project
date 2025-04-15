// Contact Form Handler
class ContactForm {
    constructor() {
        this.init();
    }

    init() {
        this.form = document.getElementById('contactForm');
        if (this.form) {
            this.setupEventListeners();
            this.prefillUserData();
        }
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmission();
        });

        // Real-time phone number validation
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                this.validatePhoneNumber(e.target);
            });
        }
    }

    prefillUserData() {
        // Pre-fill email if user is logged in
        const userSession = localStorage.getItem('userSession');
        if (userSession) {
            const userData = JSON.parse(userSession);
            const emailInput = document.getElementById('email');
            if (emailInput) {
                emailInput.value = userData.email;
            }
        }
    }

    handleSubmission() {
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value,
            timestamp: new Date().toISOString(),
            id: 'msg-' + Date.now()
        };

        if (this.validateForm(formData)) {
            this.saveMessage(formData);
            this.showConfirmation();
            this.form.reset();
        }
    }

    validateForm(data) {
        // Name validation
        if (data.name.length < 2) {
            this.showToast('Please enter a valid name', 'error');
            return false;
        }

        // Email validation
        if (!this.validateEmail(data.email)) {
            this.showToast('Please enter a valid email address', 'error');
            return false;
        }

        // Phone validation (optional)
        if (data.phone && !this.validatePhoneNumber(document.getElementById('phone'))) {
            return false;
        }

        // Subject validation
        if (data.subject.length < 3) {
            this.showToast('Please enter a valid subject', 'error');
            return false;
        }

        // Message validation
        if (data.message.length < 10) {
            this.showToast('Please enter a message with at least 10 characters', 'error');
            return false;
        }

        return true;
    }

    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    validatePhoneNumber(phoneInput) {
        const phoneNumber = phoneInput.value.trim();
        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        const isValid = phoneNumber === '' || phoneRegex.test(phoneNumber);
        
        if (!isValid && phoneNumber !== '') {
            phoneInput.classList.add('is-invalid');
            if (!phoneInput.nextElementSibling?.classList.contains('invalid-feedback')) {
                const feedback = document.createElement('div');
                feedback.className = 'invalid-feedback';
                feedback.textContent = 'Please enter a valid phone number';
                phoneInput.parentNode.appendChild(feedback);
            }
            return false;
        } else {
            phoneInput.classList.remove('is-invalid');
            const feedback = phoneInput.nextElementSibling;
            if (feedback?.classList.contains('invalid-feedback')) {
                feedback.remove();
            }
            return true;
        }
    }

    saveMessage(messageData) {
        // Get existing messages from localStorage
        const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
        
        // Add new message
        messages.push(messageData);
        
        // Save back to localStorage
        localStorage.setItem('contactMessages', JSON.stringify(messages));
    }

    showConfirmation() {
        // Create confirmation alert
        const alert = document.createElement('div');
        alert.className = 'alert alert-success alert-dismissible fade show mt-3';
        alert.innerHTML = `
            <strong>Thank you for your message!</strong>
            <p class="mb-0">We'll get back to you as soon as possible.</p>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        // Insert alert before the form
        this.form.parentNode.insertBefore(alert, this.form);

        // Remove alert after 5 seconds
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }

    showToast(message, type = 'success') {
        // Create toast container if it doesn't exist
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }

        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast ${type} show`;
        toast.innerHTML = `
            <div class="toast-header">
                <strong class="me-auto">${type === 'success' ? 'Success' : 'Error'}</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        `;

        // Add toast to container
        toastContainer.appendChild(toast);

        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Initialize contact form handler
document.addEventListener('DOMContentLoaded', () => {
    window.contactForm = new ContactForm();
});