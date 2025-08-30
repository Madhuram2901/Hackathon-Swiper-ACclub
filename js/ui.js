// UI Management Module
// Handles navigation, view switching, and UI state management

class UIManager {
    constructor() {
        this.currentView = 'discover';
        this.initializeUI();
    }

    // Initialize UI system
    initializeUI() {
        this.bindNavigationEvents();
        this.setupViewTransitions();
    }

    // Bind navigation event listeners
    bindNavigationEvents() {
        const navTabs = document.querySelectorAll('.nav-tab');
        navTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchView(tab.dataset.view);
            });
        });
    }

    // Switch between different views
    switchView(viewName) {
        // Update navigation tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.view === viewName) {
                tab.classList.add('active');
            }
        });

        // Update current view
        this.currentView = viewName;

        // Show/hide appropriate views
        const discoverView = document.getElementById('discoverView');
        const shortlistView = document.getElementById('shortlistView');
        const profileView = document.getElementById('profileView');

        // Hide all views first
        if (discoverView) discoverView.style.display = 'none';
        if (shortlistView) shortlistView.style.display = 'none';
        if (profileView) profileView.style.display = 'none';

        // Show the selected view
        if (viewName === 'discover') {
            if (discoverView) discoverView.style.display = 'block';
        } else if (viewName === 'shortlist') {
            if (shortlistView) shortlistView.style.display = 'block';
            
            // Render shortlist when switching to shortlist view
            if (window.EventManager) {
                window.EventManager.renderShortlist();
            }
        } else if (viewName === 'profile') {
            if (profileView) profileView.style.display = 'block';
            
            // Render profile when switching to profile view
            if (window.EventManager) {
                window.EventManager.renderProfile();
            }
        }
    }

    // Setup view transitions and animations
    setupViewTransitions() {
        // Add smooth transitions between views
        const views = document.querySelectorAll('.view');
        views.forEach(view => {
            view.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        });
    }

    // Show loading state
    showLoading(container, message = 'Loading...') {
        if (!container) return;
        
        container.innerHTML = `
            <div class="loading">
                ${message}
            </div>
        `;
    }

    // Hide loading state
    hideLoading(container) {
        if (!container) return;
        
        const loadingElement = container.querySelector('.loading');
        if (loadingElement) {
            loadingElement.remove();
        }
    }

    // Show empty state
    showEmptyState(container, title, message) {
        if (!container) return;
        
        container.innerHTML = `
            <div class="empty-state">
                <h2>${title}</h2>
                <p>${message}</p>
            </div>
        `;
    }

    // Show error state
    showError(container, title, message) {
        if (!container) return;
        
        container.innerHTML = `
            <div class="empty-state">
                <h2>${title}</h2>
                <p>${message}</p>
            </div>
        `;
    }

    // Update navigation badge counts
    updateNavigationBadges() {
        // Update shortlist count
        if (window.EventManager) {
            const shortlistCount = document.getElementById('shortlistCount');
            if (shortlistCount) {
                const count = window.EventManager.getShortlist().length;
                shortlistCount.textContent = count;
            }

            // Update profile tag count
            const profileTagCount = document.getElementById('profileTagCount');
            if (profileTagCount) {
                const uniqueTags = window.EventManager.getUserUniqueTags();
                profileTagCount.textContent = uniqueTags.length;
            }
        }
    }

    // Toggle mobile menu (for responsive design)
    toggleMobileMenu() {
        const navContent = document.querySelector('.nav-content');
        if (navContent) {
            navContent.classList.toggle('mobile-open');
        }
    }

    // Handle responsive behavior
    handleResponsive() {
        const handleResize = () => {
            const navContent = document.querySelector('.nav-content');
            if (navContent) {
                if (window.innerWidth <= 768) {
                    navContent.classList.add('mobile');
                } else {
                    navContent.classList.remove('mobile');
                    navContent.classList.remove('mobile-open');
                }
            }
        };

        // Initial check
        handleResize();

        // Listen for window resize
        window.addEventListener('resize', handleResize);
    }

    // Show notification
    showNotification(message, type = 'info', duration = 3000) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--danger)' : 'var(--primary)'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        // Add to DOM
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }

    // Get current view
    getCurrentView() {
        return this.currentView;
    }

    // Check if view is visible
    isViewVisible(viewName) {
        const view = document.getElementById(`${viewName}View`);
        return view && view.style.display !== 'none';
    }

    // Refresh current view
    refreshCurrentView() {
        if (this.currentView === 'discover' && window.EventManager) {
            window.EventManager.loadEventCards();
        } else if (this.currentView === 'shortlist' && window.EventManager) {
            window.EventManager.renderShortlist();
        } else if (this.currentView === 'profile' && window.EventManager) {
            window.EventManager.renderProfile();
        }
    }
}

// Initialize UI manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.UIManager = new UIManager();
    
    // Handle responsive behavior
    window.UIManager.handleResponsive();
});
