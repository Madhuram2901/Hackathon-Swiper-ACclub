// Authentication Module
// Handles user authentication, login, signup, and session management

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isLogin = true;
        this.initializeAuth();
    }

    // Initialize authentication system
    initializeAuth() {
        this.bindAuthEvents();
        this.checkExistingSession();
    }

    // Bind authentication event listeners
    bindAuthEvents() {
        const authSwitchBtn = document.getElementById('authSwitchBtn');
        const authForm = document.getElementById('authForm');
        const logoutBtn = document.getElementById('logoutBtn');

        if (authSwitchBtn) {
            authSwitchBtn.addEventListener('click', () => this.toggleAuthMode());
        }

        if (authForm) {
            authForm.addEventListener('submit', (e) => this.handleAuthSubmit(e));
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    // Toggle between login and signup modes
    toggleAuthMode() {
        this.isLogin = !this.isLogin;
        const authBtn = document.getElementById('authBtn');
        const authSwitchText = document.getElementById('authSwitchText');
        const authSwitchBtn = document.getElementById('authSwitchBtn');
        const authSubtitle = document.getElementById('authSubtitle');
        const nameGroup = document.getElementById('nameGroup');

        if (this.isLogin) {
            authBtn.textContent = 'Sign In';
            authSwitchText.textContent = "Don't have an account? ";
            authSwitchBtn.textContent = 'Sign Up';
            authSubtitle.textContent = 'Sign in to discover amazing events';
            nameGroup.style.display = 'none';
        } else {
            authBtn.textContent = 'Sign Up';
            authSwitchText.textContent = 'Already have an account? ';
            authSwitchBtn.textContent = 'Sign In';
            authSubtitle.textContent = 'Create an account to start discovering';
            nameGroup.style.display = 'block';
        }
    }

    // Handle authentication form submission
    handleAuthSubmit(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const name = document.getElementById('name').value;

        // Mock authentication - in a real app, this would call an API
        this.currentUser = {
            email,
            name: name || email.split('@')[0],
            id: Date.now()
        };

        // Store user in localStorage
        this.saveUserToStorage();
        
        // Load any saved shortlist
        this.loadUserShortlist();
        
        // Show the main app
        this.showApp();
    }

    // Logout user
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        
        // Clear shortlist
        if (window.EventManager) {
            window.EventManager.clearShortlist();
        }
        
        this.showAuth();
    }

    // Save user to localStorage
    saveUserToStorage() {
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }

    // Load user shortlist from localStorage
    loadUserShortlist() {
        if (window.EventManager && this.currentUser) {
            const savedShortlist = localStorage.getItem(`shortlist_${this.currentUser.id}`);
            if (savedShortlist) {
                const shortlist = JSON.parse(savedShortlist);
                window.EventManager.setShortlist(shortlist);
            }
        }
    }

    // Check for existing user session
    checkExistingSession() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.loadUserShortlist();
            this.showApp();
        } else {
            this.showAuth();
        }
    }

    // Show authentication screen
    showAuth() {
        const authScreen = document.getElementById('authScreen');
        const app = document.getElementById('app');
        
        if (authScreen && app) {
            authScreen.style.display = 'flex';
            app.style.display = 'none';
            
            // Clear form fields
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const nameInput = document.getElementById('name');
            
            if (emailInput) emailInput.value = '';
            if (passwordInput) passwordInput.value = '';
            if (nameInput) nameInput.value = '';
        }
    }

    // Show main application
    showApp() {
        const authScreen = document.getElementById('authScreen');
        const app = document.getElementById('app');
        
        if (authScreen && app) {
            authScreen.style.display = 'none';
            app.style.display = 'block';
            
            // Load event cards if EventManager is available
            if (window.EventManager) {
                window.EventManager.loadEventCards();
            }
        }
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }
}

// Initialize authentication manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.AuthManager = new AuthManager();
});
