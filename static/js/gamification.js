// Gamification and Interactive Features

// Drone Status Management
class DroneStatusManager {
    constructor() {
        this.statusEmojis = {
            available: '🚁',
            'in-flight': '🛩️',
            maintenance: '🔧',
            offline: '📴',
            emergency: '🚨'
        };
        this.initializeStatusIndicators();
    }

    initializeStatusIndicators() {
        document.querySelectorAll('.drone-status').forEach(indicator => {
            const status = indicator.dataset.status;
            const emoji = indicator.querySelector('.emoji');
            if (emoji && this.statusEmojis[status]) {
                emoji.textContent = this.statusEmojis[status];
            }
        });
    }

    updateDroneStatus(droneId, newStatus) {
        const indicator = document.querySelector(`[data-drone-id="${droneId}"] .drone-status`);
        if (indicator) {
            indicator.className = `drone-status ${newStatus}`;
            indicator.dataset.status = newStatus;
            const emoji = indicator.querySelector('.emoji');
            if (emoji) {
                emoji.textContent = this.statusEmojis[newStatus] || '❓';
            }
        }
    }
}

// Mission Criticality Color Scheme
class MissionCriticalityManager {
    constructor() {
        this.criticalityLevels = {
            emergency: 'critical',
            urgent: 'high',
            normal: 'medium',
            routine: 'low'
        };
        this.applyMissionColors();
    }

    applyMissionColors() {
        document.querySelectorAll('.mission-card').forEach(card => {
            const priority = card.dataset.priority;
            const criticalityClass = this.criticalityLevels[priority] || 'medium';
            card.classList.add(`mission-${criticalityClass}`);
        });
    }

    updateMissionCriticality(missionId, newPriority) {
        const card = document.querySelector(`[data-mission-id="${missionId}"]`);
        if (card) {
            // Remove existing criticality classes
            Object.values(this.criticalityLevels).forEach(level => {
                card.classList.remove(`mission-${level}`);
            });
            
            // Apply new criticality class
            const criticalityClass = this.criticalityLevels[newPriority] || 'medium';
            card.classList.add(`mission-${criticalityClass}`);
            card.dataset.priority = newPriority;
        }
    }
}

// Gamification Badge System
class BadgeManager {
    constructor() {
        this.badges = {
            firstMission: {
                name: 'First Mission',
                emoji: '🎯',
                class: 'badge-first-mission',
                condition: (stats) => stats.totalMissions >= 1
            },
            speedDemon: {
                name: 'Speed Demon',
                emoji: '⚡',
                class: 'badge-speed-demon',
                condition: (stats) => stats.avgDeliveryTime < 30
            },
            lifeSaver: {
                name: 'Life Saver',
                emoji: '💝',
                class: 'badge-life-saver',
                condition: (stats) => stats.emergencyMissions >= 5
            },
            trustedPartner: {
                name: 'Trusted Partner',
                emoji: '🤝',
                class: 'badge-trusted-partner',
                condition: (stats) => stats.successRate >= 95
            },
            emergencyHero: {
                name: 'Emergency Hero',
                emoji: '🦸',
                class: 'badge-emergency-hero',
                condition: (stats) => stats.emergencyMissions >= 10
            }
        };
        this.userStats = this.loadUserStats();
        this.checkAndAwardBadges();
    }

    loadUserStats() {
        // In a real app, this would load from backend
        return {
            totalMissions: parseInt(localStorage.getItem('totalMissions') || '0'),
            avgDeliveryTime: parseFloat(localStorage.getItem('avgDeliveryTime') || '45'),
            emergencyMissions: parseInt(localStorage.getItem('emergencyMissions') || '0'),
            successRate: parseFloat(localStorage.getItem('successRate') || '100')
        };
    }

    checkAndAwardBadges() {
        const container = document.querySelector('.badge-container');
        if (!container) return;

        Object.keys(this.badges).forEach(badgeId => {
            const badge = this.badges[badgeId];
            const hasEarned = badge.condition(this.userStats);
            const existingBadge = container.querySelector(`[data-badge-id="${badgeId}"]`);

            if (hasEarned && !existingBadge) {
                this.awardBadge(badgeId, badge, container);
            }
        });
    }

    awardBadge(badgeId, badge, container) {
        const badgeElement = document.createElement('div');
        badgeElement.className = `achievement-badge ${badge.class} new`;
        badgeElement.dataset.badgeId = badgeId;
        badgeElement.innerHTML = `
            <span class="badge-emoji">${badge.emoji}</span>
            <span class="badge-name">${badge.name}</span>
        `;

        container.appendChild(badgeElement);
        
        // Show notification
        this.showBadgeNotification(badge);
        
        // Remove 'new' class after animation
        setTimeout(() => {
            badgeElement.classList.remove('new');
        }, 600);
    }

    showBadgeNotification(badge) {
        const notification = document.createElement('div');
        notification.className = 'badge-notification';
        notification.innerHTML = `
            <div class="badge-notification-content">
                <span class="badge-emoji">${badge.emoji}</span>
                <div>
                    <strong>Badge Earned!</strong>
                    <br>${badge.name}
                </div>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #27ae60, #2ecc71);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideInRight 0.5s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }
}

// Interactive Timeline
class TimelineManager {
    constructor() {
        this.initializeTimeline();
    }

    initializeTimeline() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach(item => {
            item.addEventListener('click', () => {
                this.showTimelineDetails(item);
            });
        });
    }

    showTimelineDetails(item) {
        const details = item.dataset.details;
        if (details) {
            const modal = this.createDetailsModal(details);
            document.body.appendChild(modal);
        }
    }

    createDetailsModal(details) {
        const modal = document.createElement('div');
        modal.className = 'timeline-modal';
        modal.innerHTML = `
            <div class="timeline-modal-content">
                <div class="timeline-modal-header">
                    <h5>Timeline Details</h5>
                    <button class="timeline-modal-close">&times;</button>
                </div>
                <div class="timeline-modal-body">
                    ${details}
                </div>
            </div>
        `;
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        modal.querySelector('.timeline-modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });

        return modal;
    }
}

// Quick Action Buttons
class QuickActionsManager {
    constructor() {
        this.createQuickActions();
    }

    createQuickActions() {
        const existingActions = document.querySelector('.quick-actions');
        if (existingActions) return;

        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'quick-actions';
        
        const currentPath = window.location.pathname;
        const userRole = this.getUserRole();

        if (userRole === 'patient') {
            actionsContainer.innerHTML = `
                <a href="/emergency" class="quick-action-btn quick-action-emergency" data-tooltip="Emergency Request">
                    🚨
                </a>
                <a href="/request-delivery" class="quick-action-btn quick-action-request" data-tooltip="Request Delivery">
                    📦
                </a>
            `;
        } else if (userRole === 'clinic') {
            actionsContainer.innerHTML = `
                <a href="/emergency-alert" class="quick-action-btn quick-action-emergency" data-tooltip="Emergency Alert">
                    🚨
                </a>
                <a href="/manage-requests" class="quick-action-btn quick-action-request" data-tooltip="Manage Requests">
                    📋
                </a>
                <a href="/drone-status" class="quick-action-btn quick-action-track" data-tooltip="Drone Status">
                    🚁
                </a>
                <a href="/feedback" class="quick-action-btn quick-action-support" data-tooltip="Feedback">
                    💬
                </a>
            `;
        } else if (userRole === 'admin') {
            actionsContainer.innerHTML = `
                <a href="/system-status" class="quick-action-btn quick-action-emergency" data-tooltip="System Status">
                    📊
                </a>
                <a href="/drone-management" class="quick-action-btn quick-action-request" data-tooltip="Drone Management">
                    🚁
                </a>
                <a href="/user-management" class="quick-action-btn quick-action-track" data-tooltip="User Management">
                    👥
                </a>
                <a href="/admin/maintenance-alerts" class="quick-action-btn quick-action-support" data-tooltip="Maintenance">
                    🔧
                </a>
            `;
        }

        document.body.appendChild(actionsContainer);
    }

    getUserRole() {
        // In a real app, this would get the user role from session/auth
        const userRoleElement = document.querySelector('[data-user-role]');
        return userRoleElement ? userRoleElement.dataset.userRole : 'patient';
    }
}

// Progress Ring Component
class ProgressRing {
    constructor(element, percentage) {
        this.element = element;
        this.percentage = percentage;
        this.init();
    }

    init() {
        const progressCircle = this.element.querySelector('.progress');
        const percentageText = this.element.querySelector('.percentage');
        
        const circumference = 2 * Math.PI * 16; // radius = 16
        const offset = circumference - (this.percentage / 100) * circumference;
        
        progressCircle.style.strokeDasharray = circumference;
        progressCircle.style.strokeDashoffset = offset;
        
        if (percentageText) {
            percentageText.textContent = `${this.percentage}%`;
        }
        
        if (this.percentage === 100) {
            this.element.classList.add('complete');
        }
    }
}

// Initialize gamification system when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing SierraWings gamification system...');
    
    try {
        // Initialize all managers
        const droneStatusManager = new DroneStatusManager();
        const missionCriticalityManager = new MissionCriticalityManager();
        const badgeManager = new BadgeManager();
        const timelineManager = new TimelineManager();
        const quickActionsManager = new QuickActionsManager();
        
        // Initialize progress rings
        initializeProgressRings();
        
        // Handle timeline item clicks
        handleTimelineClicks();
        
        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            
            .timeline-modal-content {
                background: white;
                border-radius: 8px;
                padding: 20px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
            }
            
            .timeline-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 1px solid #eee;
            }
            
            .timeline-modal-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                color: #999;
            }
            
            .timeline-modal-close:hover {
                color: #333;
            }
        `;
        document.head.appendChild(style);
        
        console.log('SierraWings Gamification System initialized successfully!');
    } catch (error) {
        console.error('Error initializing gamification system:', error);
    }
});

// Export for use in other modules
window.SierraWingsGamification = {
    DroneStatusManager,
    MissionCriticalityManager,
    BadgeManager,
    TimelineManager,
    QuickActionsManager,
    ProgressRing,
    init: function() {
        console.log('SierraWings Gamification System initialized via export');
        // Initialize all managers if needed
        if (typeof DroneStatusManager !== 'undefined') {
            new DroneStatusManager();
        }
        if (typeof MissionCriticalityManager !== 'undefined') {
            new MissionCriticalityManager();
        }
        if (typeof BadgeManager !== 'undefined') {
            new BadgeManager();
        }
        if (typeof TimelineManager !== 'undefined') {
            new TimelineManager();
        }
        if (typeof QuickActionsManager !== 'undefined') {
            new QuickActionsManager();
        }
        if (typeof initializeProgressRings !== 'undefined') {
            initializeProgressRings();
        }
        if (typeof handleTimelineClicks !== 'undefined') {
            handleTimelineClicks();
        }
    }
};

// Helper functions for progress rings and timeline
function initializeProgressRings() {
    document.querySelectorAll('.progress-ring').forEach(ring => {
        const percentage = parseInt(ring.dataset.percentage || '0');
        new ProgressRing(ring, percentage);
    });
}

function handleTimelineClicks() {
    document.querySelectorAll('.timeline-item').forEach(item => {
        item.addEventListener('click', function() {
            const details = this.dataset.details;
            if (details) {
                console.log('Timeline item clicked:', details);
            }
        });
    });
}

// Ensure all JavaScript files are properly closed
console.log('Gamification system fully loaded');