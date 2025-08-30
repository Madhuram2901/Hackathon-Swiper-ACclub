// Main Application Module
// Coordinates all modules and manages the overall application state

class EventSwipeApp {
    constructor() {
        this.modules = {};
        this.isInitialized = false;
        this.initializeApp();
    }

    // Initialize the main application
    initializeApp() {
        try {
            this.waitForModules();
            this.setupGlobalErrorHandling();
            this.setupPerformanceMonitoring();
            console.log('EventSwipe App initialized successfully');
        } catch (error) {
            console.error('Failed to initialize EventSwipe App:', error);
        }
    }

    // Wait for all required modules to be loaded
    waitForModules() {
        const requiredModules = ['DataManager', 'AuthManager', 'EventManager', 'UIManager'];
        
        const checkModules = () => {
            const allLoaded = requiredModules.every(module => window[module]);
            
            if (allLoaded) {
                this.onModulesReady();
            } else {
                setTimeout(checkModules, 100);
            }
        };

        checkModules();
    }

    // Called when all modules are ready
    onModulesReady() {
        this.modules = {
            data: window.DataManager,
            auth: window.AuthManager,
            events: window.EventManager,
            ui: window.UIManager
        };

        this.isInitialized = true;
        this.setupModuleCommunication();
        this.setupEventListeners();
        this.performInitialSetup();
    }

    // Setup communication between modules
    setupModuleCommunication() {
        // Ensure modules can communicate with each other
        if (this.modules.auth && this.modules.events) {
            // Auth manager can notify events manager about user changes
            this.modules.auth.onUserChange = (user) => {
                if (user) {
                    this.modules.events.loadUserShortlist();
                    this.modules.events.loadUserActivity();
                } else {
                    this.modules.events.clearShortlist();
                }
            };
        }

        if (this.modules.events && this.modules.ui) {
            // Events manager can notify UI manager about shortlist changes
            this.modules.events.onShortlistChange = () => {
                this.modules.ui.updateNavigationBadges();
            };
        }
    }

    // Setup global event listeners
    setupEventListeners() {
        // Handle app-wide events
        window.addEventListener('beforeunload', () => {
            this.saveAppState();
        });

        // Handle visibility change (tab switching)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.saveAppState();
            } else {
                this.restoreAppState();
            }
        });

        // Handle online/offline status
        window.addEventListener('online', () => {
            this.handleOnlineStatus(true);
        });

        window.addEventListener('offline', () => {
            this.handleOnlineStatus(false);
        });
    }

    // Perform initial setup tasks
    performInitialSetup() {
        // Check if user is already authenticated
        if (this.modules.auth && this.modules.auth.isAuthenticated()) {
            // User is logged in, ensure UI is properly set up
            this.modules.ui.refreshCurrentView();
            
            // Update navigation badges
            if (this.modules.ui) {
                this.modules.ui.updateNavigationBadges();
            }
        }

        // Setup any additional features
        this.setupAnalytics();
        this.setupServiceWorker();
    }

    // Setup analytics (placeholder for future implementation)
    setupAnalytics() {
        // This would integrate with analytics services like Google Analytics
        console.log('Analytics setup complete');
    }

    // Setup service worker (placeholder for future implementation)
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            // This would register a service worker for offline functionality
            console.log('Service Worker support detected');
        }
    }

    // Setup global error handling
    setupGlobalErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('Global error caught:', event.error);
            this.handleError(event.error);
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.handleError(event.reason);
        });
    }

    // Handle errors gracefully
    handleError(error) {
        // Log error
        console.error('Application error:', error);

        // Show user-friendly error message
        if (this.modules.ui) {
            this.modules.ui.showNotification(
                'Something went wrong. Please try refreshing the page.',
                'error',
                5000
            );
        }

        // In a production app, you might want to send error reports to a service
        // this.reportError(error);
    }

    // Setup performance monitoring
    setupPerformanceMonitoring() {
        if ('performance' in window) {
            // Monitor page load performance
            window.addEventListener('load', () => {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                console.log(`Page loaded in ${loadTime}ms`);
            });
        }
    }

    // Save application state
    saveAppState() {
        try {
            const appState = {
                currentView: this.modules.ui ? this.modules.ui.getCurrentView() : 'discover',
                timestamp: Date.now()
            };

            localStorage.setItem('appState', JSON.stringify(appState));
        } catch (error) {
            console.error('Failed to save app state:', error);
        }
    }

    // Restore application state
    restoreAppState() {
        try {
            const savedState = localStorage.getItem('appState');
            if (savedState) {
                const appState = JSON.parse(savedState);
                
                // Restore view if it's been less than 1 hour
                const timeDiff = Date.now() - appState.timestamp;
                if (timeDiff < 3600000 && this.modules.ui) {
                    this.modules.ui.switchView(appState.currentView);
                }
            }
        } catch (error) {
            console.error('Failed to restore app state:', error);
        }
    }

    // Handle online/offline status changes
    handleOnlineStatus(isOnline) {
        if (isOnline) {
            console.log('Application is back online');
            if (this.modules.ui) {
                this.modules.ui.showNotification('You are back online!', 'success');
            }
        } else {
            console.log('Application is offline');
            if (this.modules.ui) {
                this.modules.ui.showNotification('You are offline. Some features may not work.', 'error');
            }
        }
    }

    // Get application status
    getAppStatus() {
        return {
            isInitialized: this.isInitialized,
            modules: Object.keys(this.modules),
            currentView: this.modules.ui ? this.modules.ui.getCurrentView() : null,
            isAuthenticated: this.modules.auth ? this.modules.auth.isAuthenticated() : false,
            shortlistCount: this.modules.events ? this.modules.events.getShortlist().length : 0,
            uniqueTagsCount: this.modules.events ? this.modules.events.getUserUniqueTags().length : 0
        };
    }

    // Refresh the application
    refresh() {
        if (this.modules.ui) {
            this.modules.ui.refreshCurrentView();
        }
    }

    // Cleanup application
    cleanup() {
        // Save state before cleanup
        this.saveAppState();
        
        // Remove event listeners
        window.removeEventListener('beforeunload', this.saveAppState);
        window.removeEventListener('visibilitychange', this.handleVisibilityChange);
        
        console.log('EventSwipe App cleaned up');
    }
}

// Initialize the main application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.EventSwipeApp = new EventSwipeApp();
});

// Make app available globally for debugging
window.getAppStatus = () => {
    return window.EventSwipeApp ? window.EventSwipeApp.getAppStatus() : 'App not initialized';
};
