// Events Management Module
// Handles event cards, swiping, and shortlist functionality

class EventManager {
    constructor() {
        this.currentEventIndex = 0;
        this.shortlist = [];
        this.userActivity = [];
        this.initializeEvents();
    }

    // Initialize events system
    initializeEvents() {
        this.bindEventListeners();
        this.loadUserActivity();
    }

    // Bind event listeners
    bindEventListeners() {
        const rejectBtn = document.getElementById('rejectBtn');
        const saveBtn = document.getElementById('saveBtn');

        if (rejectBtn) {
            rejectBtn.addEventListener('click', () => this.rejectEvent());
        }

        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveEvent());
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (window.AuthManager && window.AuthManager.isAuthenticated()) {
                const discoverView = document.getElementById('discoverView');
                if (discoverView && discoverView.style.display !== 'none') {
                    if (e.key === 'ArrowLeft') {
                        this.rejectEvent();
                    } else if (e.key === 'ArrowRight') {
                        this.saveEvent();
                    }
                }
            }
        });
    }

    // Create event card element
    createEventCard(event, index) {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.style.zIndex = window.DataManager.getEvents().length - index;
        
        card.innerHTML = `
            <div class="card-image">
                <span>${event.emoji}</span>
                <span class="card-badge">${event.category}</span>
                <div class="card-tags">
                    ${event.tags.map(tag => `<span class="card-tag">${tag}</span>`).join('')}
                </div>
            </div>
            <div class="card-content">
                <h2 class="card-title">${event.title}</h2>
                <div class="card-info">
                    <div class="info-item">
                        <span>📅</span>
                        <span>${window.DataManager.formatDate(event.date)}</span>
                    </div>
                    <div class="info-item">
                        <span>⏰</span>
                        <span>${event.time}</span>
                    </div>
                    <div class="info-item">
                        <span>📍</span>
                        <span>${event.location}</span>
                    </div>
                </div>
                <p class="card-description">${event.description}</p>
                <div class="card-price">${event.price}</div>
            </div>
        `;

        // Add touch/mouse handling
        this.addCardInteraction(card, event, index);

        return card;
    }

    // Add interaction handlers to event card
    addCardInteraction(card, event, index) {
        let startX = 0;
        let startY = 0;
        let currentX = 0;
        let currentY = 0;
        let cardBeingDragged = false;

        const handleStart = (clientX, clientY) => {
            if (index !== 0) return;
            cardBeingDragged = true;
            card.classList.add('dragging');
            startX = clientX;
            startY = clientY;
        };

        const handleMove = (clientX, clientY) => {
            if (!cardBeingDragged) return;
            currentX = clientX - startX;
            currentY = clientY - startY;
            const rotation = currentX / 10;
            card.style.transform = `translateX(${currentX}px) translateY(${currentY}px) rotate(${rotation}deg)`;
            card.style.opacity = 1 - Math.abs(currentX) / 300;
        };

        const handleEnd = () => {
            if (!cardBeingDragged) return;
            cardBeingDragged = false;
            card.classList.remove('dragging');

            const threshold = 100;
            if (Math.abs(currentX) > threshold) {
                if (currentX > 0) {
                    this.addToShortlist(event);
                    card.classList.add('swiped-right');
                } else {
                    card.classList.add('swiped-left');
                }
                setTimeout(() => this.nextCard(), 500);
            } else {
                card.style.transform = '';
                card.style.opacity = '';
            }
        };

        // Mouse events
        card.addEventListener('mousedown', (e) => handleStart(e.clientX, e.clientY));
        document.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
        document.addEventListener('mouseup', handleEnd);

        // Touch events
        card.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            handleStart(touch.clientX, touch.clientY);
        });
        card.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            handleMove(touch.clientX, touch.clientY);
        });
        card.addEventListener('touchend', handleEnd);
    }

    // Load event cards
    loadEventCards() {
        const cardStack = document.getElementById('cardStack');
        if (!cardStack) return;

        cardStack.innerHTML = '';
        const events = window.DataManager.getEvents();
        const cardsToShow = events.slice(this.currentEventIndex, this.currentEventIndex + 3);
        
        cardsToShow.forEach((event, index) => {
            const card = this.createEventCard(event, index);
            cardStack.appendChild(card);
        });

        if (cardsToShow.length === 0) {
            cardStack.innerHTML = `
                <div class="empty-state">
                    <h2>No more events!</h2>
                    <p>Check back later for more amazing events</p>
                </div>
            `;
        }
    }

    // Move to next card
    nextCard() {
        this.currentEventIndex++;
        const events = window.DataManager.getEvents();
        if (this.currentEventIndex >= events.length) {
            this.currentEventIndex = 0; // Loop back to start
        }
        this.loadEventCards();
    }

    // Reject current event
    rejectEvent() {
        const topCard = document.querySelector('.event-card:first-child');
        if (topCard && !topCard.classList.contains('swiped-left') && !topCard.classList.contains('swiped-right')) {
            topCard.classList.add('swiped-left');
            setTimeout(() => this.nextCard(), 500);
        }
    }

    // Save current event
    saveEvent() {
        const topCard = document.querySelector('.event-card:first-child');
        if (topCard && !topCard.classList.contains('swiped-left') && !topCard.classList.contains('swiped-right')) {
            const events = window.DataManager.getEvents();
            const event = events[this.currentEventIndex];
            this.addToShortlist(event);
            topCard.classList.add('swiped-right');
            setTimeout(() => this.nextCard(), 500);
        }
    }

    // Add event to shortlist
    addToShortlist(event) {
        if (!this.shortlist.find(e => e.id === event.id)) {
            this.shortlist.push(event);
            this.updateShortlistCount();
            this.saveShortlistToStorage();
            this.addUserActivity('saved', event);
            this.updateProfileTagCount();
        }
    }

    // Remove event from shortlist
    removeFromShortlist(eventId) {
        const event = this.shortlist.find(e => e.id === eventId);
        if (event) {
            this.addUserActivity('removed', event);
        }
        
        this.shortlist = this.shortlist.filter(e => e.id !== eventId);
        this.updateShortlistCount();
        this.saveShortlistToStorage();
        this.renderShortlist();
        this.updateProfileTagCount();
    }

    // Update shortlist count display
    updateShortlistCount() {
        const shortlistCount = document.getElementById('shortlistCount');
        if (shortlistCount) {
            shortlistCount.textContent = this.shortlist.length;
        }
    }

    // Update profile tag count display
    updateProfileTagCount() {
        const profileTagCount = document.getElementById('profileTagCount');
        if (profileTagCount) {
            const uniqueTags = this.getUserUniqueTags();
            profileTagCount.textContent = uniqueTags.length;
        }
    }

    // Save shortlist to localStorage
    saveShortlistToStorage() {
        if (window.AuthManager && window.AuthManager.getCurrentUser()) {
            const userId = window.AuthManager.getCurrentUser().id;
            localStorage.setItem(`shortlist_${userId}`, JSON.stringify(this.shortlist));
        }
    }

    // Render shortlist view
    renderShortlist() {
        const shortlistGrid = document.getElementById('shortlistGrid');
        if (!shortlistGrid) return;

        if (this.shortlist.length === 0) {
            shortlistGrid.innerHTML = `
                <div class="empty-state">
                    <h2>No saved events yet!</h2>
                    <p>Start swiping to save events you're interested in</p>
                </div>
            `;
            return;
        }

        shortlistGrid.innerHTML = this.shortlist.map(event => `
            <div class="shortlist-card">
                <div class="shortlist-header">
                    <h3 class="shortlist-title">${event.title}</h3>
                    <button class="remove-btn" onclick="window.EventManager.removeFromShortlist(${event.id})">Remove</button>
                </div>
                <div class="shortlist-info">
                    <div class="shortlist-info-item">
                        <span>📅</span>
                        <span>${window.DataManager.formatDate(event.date)}</span>
                    </div>
                    <div class="shortlist-info-item">
                        <span>⏰</span>
                        <span>${event.time}</span>
                    </div>
                    <div class="shortlist-info-item">
                        <span>📍</span>
                        <span>${event.location}</span>
                    </div>
                    <div class="shortlist-info-item">
                        <span>💰</span>
                        <span>${event.price}</span>
                    </div>
                </div>
                <div class="shortlist-tags">
                    ${event.tags.map(tag => `<span class="card-tag">${tag}</span>`).join('')}
                </div>
            </div>
        `).join('');
    }

    // Set shortlist (for loading from storage)
    setShortlist(shortlist) {
        this.shortlist = shortlist || [];
        this.updateShortlistCount();
        this.updateProfileTagCount();
    }

    // Clear shortlist
    clearShortlist() {
        this.shortlist = [];
        this.currentEventIndex = 0;
        this.updateShortlistCount();
        this.updateProfileTagCount();
    }

    // Get shortlist
    getShortlist() {
        return this.shortlist;
    }

    // Get user's unique tags from shortlisted events
    getUserUniqueTags() {
        const allTags = new Set();
        this.shortlist.forEach(event => {
            event.tags.forEach(tag => allTags.add(tag));
        });
        return Array.from(allTags).sort();
    }

    // Get tag statistics for user
    getUserTagStats() {
        const tagStats = {};
        this.shortlist.forEach(event => {
            event.tags.forEach(tag => {
                tagStats[tag] = (tagStats[tag] || 0) + 1;
            });
        });
        return tagStats;
    }

    // Get events grouped by tag
    getEventsByTag() {
        const tagGroups = {};
        this.shortlist.forEach(event => {
            event.tags.forEach(tag => {
                if (!tagGroups[tag]) {
                    tagGroups[tag] = [];
                }
                tagGroups[tag].push(event);
            });
        });
        return tagGroups;
    }

    // Add user activity
    addUserActivity(action, event) {
        const activity = {
            id: Date.now(),
            action: action,
            eventTitle: event.title,
            eventId: event.id,
            timestamp: new Date().toISOString(),
            tags: event.tags
        };

        this.userActivity.unshift(activity);
        
        // Keep only last 20 activities
        if (this.userActivity.length > 20) {
            this.userActivity = this.userActivity.slice(0, 20);
        }

        this.saveUserActivity();
    }

    // Save user activity to localStorage
    saveUserActivity() {
        if (window.AuthManager && window.AuthManager.getCurrentUser()) {
            const userId = window.AuthManager.getCurrentUser().id;
            localStorage.setItem(`userActivity_${userId}`, JSON.stringify(this.userActivity));
        }
    }

    // Load user activity from localStorage
    loadUserActivity() {
        if (window.AuthManager && window.AuthManager.getCurrentUser()) {
            const userId = window.AuthManager.getCurrentUser().id;
            const savedActivity = localStorage.getItem(`userActivity_${userId}`);
            if (savedActivity) {
                this.userActivity = JSON.parse(savedActivity);
            }
        }
    }

    // Get user activity
    getUserActivity() {
        return this.userActivity;
    }

    // Render profile view
    renderProfile() {
        this.updateProfileInfo();
        this.renderUserTags();
        this.renderTaggedEvents();
        this.renderActivityTimeline();
    }

    // Update profile information
    updateProfileInfo() {
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        const profileAvatar = document.getElementById('profileAvatar');
        const totalEvents = document.getElementById('totalEvents');
        const totalTags = document.getElementById('totalTags');

        if (window.AuthManager && window.AuthManager.getCurrentUser()) {
            const user = window.AuthManager.getCurrentUser();
            if (profileName) profileName.textContent = user.name;
            if (profileEmail) profileEmail.textContent = user.email;
            if (profileAvatar) profileAvatar.textContent = user.name.charAt(0).toUpperCase();
        }

        if (totalEvents) totalEvents.textContent = this.shortlist.length;
        if (totalTags) totalTags.textContent = this.getUserUniqueTags().length;
    }

    // Render user tags
    renderUserTags() {
        const userTagsContainer = document.getElementById('userTagsContainer');
        if (!userTagsContainer) return;

        const tagStats = this.getUserTagStats();
        const uniqueTags = this.getUserUniqueTags();

        if (uniqueTags.length === 0) {
            userTagsContainer.innerHTML = `
                <div class="empty-state">
                    <h2>No tags yet!</h2>
                    <p>Start saving events to see your interest tags</p>
                </div>
            `;
            return;
        }

        userTagsContainer.innerHTML = uniqueTags.map(tag => `
            <div class="user-tag">
                <span>${tag}</span>
                <span class="tag-count">${tagStats[tag]}</span>
            </div>
        `).join('');
    }

    // Render tagged events
    renderTaggedEvents() {
        const taggedEventsContainer = document.getElementById('taggedEventsContainer');
        if (!taggedEventsContainer) return;

        const tagGroups = this.getEventsByTag();

        if (Object.keys(tagGroups).length === 0) {
            taggedEventsContainer.innerHTML = `
                <div class="empty-state">
                    <h2>No tagged events yet!</h2>
                    <p>Save some events to see them organized by tags</p>
                </div>
            `;
            return;
        }

        taggedEventsContainer.innerHTML = Object.entries(tagGroups).map(([tag, events]) => `
            <div class="tag-group">
                <div class="tag-group-header">
                    <span class="tag-group-title">${tag}</span>
                    <span class="tag-group-count">${events.length}</span>
                </div>
                <div class="tag-group-events">
                    ${events.map(event => `
                        <div class="tag-event-item">
                            <span class="tag-event-emoji">${event.emoji}</span>
                            <div class="tag-event-info">
                                <div class="tag-event-title">${event.title}</div>
                                <div class="tag-event-details">${event.date} • ${event.location}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    // Render activity timeline
    renderActivityTimeline() {
        const activityTimeline = document.getElementById('activityTimeline');
        if (!activityTimeline) return;

        if (this.userActivity.length === 0) {
            activityTimeline.innerHTML = `
                <div class="empty-state">
                    <h2>No activity yet!</h2>
                    <p>Your event interactions will appear here</p>
                </div>
            `;
            return;
        }

        activityTimeline.innerHTML = this.userActivity.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    ${activity.action === 'saved' ? '♥' : '✕'}
                </div>
                <div class="activity-content">
                    <div class="activity-text">
                        ${activity.action === 'saved' ? 'Saved' : 'Removed'} "${activity.eventTitle}"
                    </div>
                    <div class="activity-time">
                        ${this.formatActivityTime(activity.timestamp)}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Format activity timestamp
    formatActivityTime(timestamp) {
        const now = new Date();
        const activityTime = new Date(timestamp);
        const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hour${Math.floor(diffInMinutes / 60) > 1 ? 's' : ''} ago`;
        return `${Math.floor(diffInMinutes / 1440)} day${Math.floor(diffInMinutes / 1440) > 1 ? 's' : ''} ago`;
    }
}

// Initialize events manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.EventManager = new EventManager();
});
