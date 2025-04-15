// User Authentication Module
class Auth {
    constructor() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.init();
    }

    init() {
        // Check for existing session
        const session = localStorage.getItem('userSession');
        if (session) {
            const userData = JSON.parse(session);
            this.isAuthenticated = true;
            this.currentUser = userData;
            this.updateUI(true);
        }

        // Add event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Login form submission
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Registration form submission
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegistration();
            });
        }
    }

    handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Basic validation
        if (!this.validateEmail(email)) {
            this.showToast('Please enter a valid email address', 'error');
            return;
        }

        if (!password) {
            this.showToast('Please enter your password', 'error');
            return;
        }

        // Check if user exists in localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === this.hashPassword(password));

        if (user) {
            // Create session
            this.isAuthenticated = true;
            this.currentUser = {
                name: user.name,
                email: user.email
            };
            localStorage.setItem('userSession', JSON.stringify(this.currentUser));
            
            // Update UI and close modal
            this.updateUI(true);
            this.closeModal('loginModal');
            this.showToast('Successfully logged in!', 'success');
        } else {
            this.showToast('Invalid email or password', 'error');
        }
    }

    handleRegistration() {
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;

        // Validation
        if (!name || name.length < 2) {
            this.showToast('Please enter a valid name', 'error');
            return;
        }

        if (!this.validateEmail(email)) {
            this.showToast('Please enter a valid email address', 'error');
            return;
        }

        if (!password || password.length < 6) {
            this.showToast('Password must be at least 6 characters long', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showToast('Passwords do not match', 'error');
            return;
        }

        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.some(user => user.email === email)) {
            this.showToast('Email already registered', 'error');
            return;
        }

        // Add new user
        const newUser = {
            name,
            email,
            password: this.hashPassword(password)
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Auto login after registration
        this.isAuthenticated = true;
        this.currentUser = {
            name: newUser.name,
            email: newUser.email
        };
        localStorage.setItem('userSession', JSON.stringify(this.currentUser));

        // Update UI and close modal
        this.updateUI(true);
        this.closeModal('registerModal');
        this.showToast('Registration successful!', 'success');
    }

    logout() {
        this.isAuthenticated = false;
        this.currentUser = null;
        localStorage.removeItem('userSession');
        this.updateUI(false);
        this.showToast('Successfully logged out', 'success');
    }

    updateUI(isLoggedIn) {
        const loginBtn = document.querySelector('.nav-item .btn-primary');
        if (loginBtn) {
            if (isLoggedIn) {
                // Create dropdown for logged-in user
                const dropdown = `
                    <div class="dropdown">
                        <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                            ${this.currentUser.name}
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#" id="logoutBtn">Logout</a></li>
                        </ul>
                    </div>
                `;
                loginBtn.parentElement.innerHTML = dropdown;
                
                // Add logout event listener
                document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
            } else {
                // Restore login button
                loginBtn.parentElement.innerHTML = `
                    <a class="nav-link btn btn-primary text-white ms-2" href="#" data-bs-toggle="modal" data-bs-target="#loginModal">
                        Login
                    </a>
                `;
            }
        }
    }

    // Utility functions
    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    hashPassword(password) {
        // This is a simple hash for demo purposes
        // In production, use a proper hashing library
        return btoa(password);
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        const bootstrapModal = bootstrap.Modal.getInstance(modal);
        bootstrapModal.hide();
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

// Initialize authentication
document.addEventListener('DOMContentLoaded', () => {
    window.auth = new Auth();
});