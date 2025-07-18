/**
 * Animated Mission Progress Visualization
 * Shows real-time drone mission progress with animations
 */

class MissionProgressVisualization {
    constructor() {
        this.activeAnimations = new Map();
        this.init();
    }

    init() {
        this.createProgressStyles();
        this.initializeProgressBars();
        this.startProgressUpdates();
    }

    createProgressStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .mission-progress-container {
                position: relative;
                background: #f8f9fa;
                border-radius: 8px;
                padding: 20px;
                margin: 15px 0;
                border: 1px solid #e9ecef;
            }
            
            .mission-progress-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
            }
            
            .mission-status-badge {
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .status-requested { background: #fff3cd; color: #856404; }
            .status-accepted { background: #cce5ff; color: #004085; }
            .status-assigned { background: #e2e3e5; color: #383d41; }
            .status-in-progress { background: #d1ecf1; color: #0c5460; }
            .status-completed { background: #d4edda; color: #155724; }
            .status-failed { background: #f8d7da; color: #721c24; }
            
            .progress-timeline {
                position: relative;
                padding: 20px 0;
            }
            
            .progress-step {
                position: relative;
                display: flex;
                align-items: center;
                margin-bottom: 25px;
                padding-left: 40px;
            }
            
            .progress-step::before {
                content: '';
                position: absolute;
                left: 15px;
                top: 50%;
                transform: translateY(-50%);
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: #dee2e6;
                border: 2px solid #6c757d;
                z-index: 2;
            }
            
            .progress-step.active::before {
                background: #3498db;
                border-color: #3498db;
                box-shadow: 0 0 0 4px rgba(52, 152, 219, 0.2);
                animation: pulse 2s infinite;
            }
            
            .progress-step.completed::before {
                background: #27ae60;
                border-color: #27ae60;
                content: '✓';
                color: white;
                font-size: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
            }
            
            .progress-step:not(:last-child)::after {
                content: '';
                position: absolute;
                left: 19px;
                top: calc(50% + 5px);
                width: 2px;
                height: 25px;
                background: #dee2e6;
                z-index: 1;
            }
            
            .progress-step.completed:not(:last-child)::after {
                background: #27ae60;
                animation: fillDown 0.5s ease-out;
            }
            
            .step-content {
                flex: 1;
                margin-left: 15px;
            }
            
            .step-title {
                font-weight: 600;
                color: #2c3e50;
                margin-bottom: 5px;
            }
            
            .step-description {
                color: #6c757d;
                font-size: 14px;
                margin-bottom: 5px;
            }
            
            .step-timestamp {
                color: #adb5bd;
                font-size: 12px;
            }
            
            .step-details {
                display: flex;
                align-items: center;
                gap: 15px;
                margin-top: 10px;
            }
            
            .drone-info {
                display: flex;
                align-items: center;
                gap: 5px;
                padding: 4px 8px;
                background: #e9ecef;
                border-radius: 4px;
                font-size: 12px;
            }
            
            .eta-info {
                display: flex;
                align-items: center;
                gap: 5px;
                padding: 4px 8px;
                background: #fff3cd;
                border-radius: 4px;
                font-size: 12px;
                color: #856404;
            }
            
            .progress-bar-container {
                position: relative;
                height: 8px;
                background: #e9ecef;
                border-radius: 4px;
                overflow: hidden;
                margin: 10px 0;
            }
            
            .progress-bar {
                height: 100%;
                background: linear-gradient(90deg, #3498db, #2ecc71);
                border-radius: 4px;
                transition: width 0.5s ease-out;
                position: relative;
            }
            
            .progress-bar::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                width: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                animation: shimmer 2s infinite;
            }
            
            @keyframes pulse {
                0% { box-shadow: 0 0 0 0 rgba(52, 152, 219, 0.4); }
                70% { box-shadow: 0 0 0 10px rgba(52, 152, 219, 0); }
                100% { box-shadow: 0 0 0 0 rgba(52, 152, 219, 0); }
            }
            
            @keyframes fillDown {
                from { height: 0; }
                to { height: 25px; }
            }
            
            @keyframes shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
            
            .delivery-map-preview {
                height: 200px;
                background: #f8f9fa;
                border-radius: 6px;
                margin: 15px 0;
                position: relative;
                overflow: hidden;
            }
            
            .map-route {
                position: absolute;
                top: 50%;
                left: 10%;
                right: 10%;
                height: 2px;
                background: #3498db;
                transform: translateY(-50%);
            }
            
            .map-drone {
                position: absolute;
                top: 50%;
                background: #3498db;
                color: white;
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 12px;
                transform: translateY(-50%);
                transition: left 0.5s ease-out;
            }
            
            .map-waypoint {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: 12px;
                height: 12px;
                border-radius: 50%;
                border: 2px solid white;
                box-shadow: 0 0 0 2px #3498db;
            }
            
            .waypoint-pickup { left: 10%; background: #f39c12; }
            .waypoint-delivery { right: 10%; background: #27ae60; }
        `;
        document.head.appendChild(style);
    }

    initializeProgressBars() {
        document.querySelectorAll('.mission-card').forEach(card => {
            const missionId = card.dataset.missionId;
            const status = card.dataset.status;
            
            if (missionId && status) {
                this.createProgressVisualization(card, missionId, status);
            }
        });
    }

    createProgressVisualization(container, missionId, status) {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'mission-progress-container';
        progressContainer.innerHTML = this.generateProgressHTML(missionId, status);
        
        const existingProgress = container.querySelector('.mission-progress-container');
        if (existingProgress) {
            existingProgress.replaceWith(progressContainer);
        } else {
            container.appendChild(progressContainer);
        }
        
        this.animateProgress(missionId, status);
    }

    generateProgressHTML(missionId, status) {
        const steps = this.getProgressSteps(status);
        const progress = this.calculateProgress(status);
        
        return `
            <div class="mission-progress-header">
                <h6>Mission Progress</h6>
                <span class="mission-status-badge status-${status}">
                    ${status.replace('_', ' ').toUpperCase()}
                </span>
            </div>
            
            <div class="progress-bar-container">
                <div class="progress-bar" style="width: ${progress}%"></div>
            </div>
            
            <div class="progress-timeline">
                ${steps.map(step => `
                    <div class="progress-step ${step.status}">
                        <div class="step-content">
                            <div class="step-title">${step.title}</div>
                            <div class="step-description">${step.description}</div>
                            ${step.timestamp ? `<div class="step-timestamp">${step.timestamp}</div>` : ''}
                            ${step.details ? `
                                <div class="step-details">
                                    ${step.droneId ? `<div class="drone-info">🚁 Drone ${step.droneId}</div>` : ''}
                                    ${step.eta ? `<div class="eta-info">⏱️ ETA: ${step.eta}</div>` : ''}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
            
            ${this.shouldShowMap(status) ? `
                <div class="delivery-map-preview">
                    <div class="map-route"></div>
                    <div class="map-waypoint waypoint-pickup"></div>
                    <div class="map-waypoint waypoint-delivery"></div>
                    <div class="map-drone" id="drone-${missionId}">🚁 Drone</div>
                </div>
            ` : ''}
        `;
    }

    getProgressSteps(status) {
        const allSteps = [
            {
                key: 'requested',
                title: 'Request Submitted',
                description: 'Medical delivery request has been submitted',
                status: 'completed'
            },
            {
                key: 'accepted',
                title: 'Request Accepted',
                description: 'Medical facility has accepted the request',
                status: status === 'requested' ? 'pending' : 'completed'
            },
            {
                key: 'assigned',
                title: 'Drone Assigned',
                description: 'Drone has been assigned to this mission',
                status: ['requested', 'accepted'].includes(status) ? 'pending' : 'completed'
            },
            {
                key: 'in_progress',
                title: 'In Transit',
                description: 'Drone is en route to delivery location',
                status: status === 'in_progress' ? 'active' : 
                       ['requested', 'accepted', 'assigned'].includes(status) ? 'pending' : 'completed',
                details: status === 'in_progress',
                droneId: status === 'in_progress' ? 'DRN-001' : null,
                eta: status === 'in_progress' ? '15 min' : null
            },
            {
                key: 'completed',
                title: 'Delivered',
                description: 'Medical supplies successfully delivered',
                status: status === 'completed' ? 'completed' : 'pending'
            }
        ];

        return allSteps.filter(step => {
            if (status === 'failed') {
                return ['requested', 'accepted', 'assigned'].includes(step.key);
            }
            return true;
        });
    }

    calculateProgress(status) {
        const progressMap = {
            'requested': 20,
            'accepted': 40,
            'assigned': 60,
            'in_progress': 80,
            'completed': 100,
            'failed': 60
        };
        return progressMap[status] || 0;
    }

    shouldShowMap(status) {
        return ['assigned', 'in_progress', 'completed'].includes(status);
    }

    animateProgress(missionId, status) {
        if (status === 'in_progress') {
            this.animateDroneMovement(missionId);
        }
    }

    animateDroneMovement(missionId) {
        const drone = document.getElementById(`drone-${missionId}`);
        if (!drone) return;

        const container = drone.parentElement;
        const containerWidth = container.offsetWidth;
        const droneWidth = drone.offsetWidth;
        const maxLeft = containerWidth - droneWidth - (containerWidth * 0.1);
        
        let position = 0;
        const animate = () => {
            position += 0.5;
            if (position <= maxLeft) {
                drone.style.left = `${10 + position}%`;
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }

    updateMissionProgress(missionId, newStatus, additionalData = {}) {
        const card = document.querySelector(`[data-mission-id="${missionId}"]`);
        if (card) {
            card.dataset.status = newStatus;
            this.createProgressVisualization(card, missionId, newStatus);
        }
    }

    startProgressUpdates() {
        // Simulate real-time updates (replace with actual API calls)
        setInterval(() => {
            this.updateActiveProgressBars();
        }, 5000);
    }

    updateActiveProgressBars() {
        document.querySelectorAll('.progress-step.active').forEach(step => {
            // Add subtle animation to active steps
            step.style.transform = 'scale(1.02)';
            setTimeout(() => {
                step.style.transform = 'scale(1)';
            }, 200);
        });
    }
}

// Initialize mission progress visualization
document.addEventListener('DOMContentLoaded', function() {
    window.missionProgressVisualization = new MissionProgressVisualization();
});