/**
 * Contextual Help Tooltips System
 * Provides guided help for users across the application
 */

// Check if class already exists to prevent duplicate declarations
if (typeof window.ContextualHelp === 'undefined') {
    window.ContextualHelp = class ContextualHelp {
    constructor() {
        this.tooltips = new Map();
        this.init();
    }

    init() {
        this.createTooltipStyles();
        this.setupTooltips();
        this.bindEvents();
    }

    createTooltipStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .contextual-help-tooltip {
                position: absolute;
                background: #2c3e50;
                color: white;
                padding: 12px 16px;
                border-radius: 8px;
                font-size: 14px;
                max-width: 280px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 1000;
                opacity: 0;
                transform: translateY(-10px);
                transition: all 0.3s ease;
                pointer-events: none;
                line-height: 1.4;
            }

            .contextual-help-tooltip.show {
                opacity: 1;
                transform: translateY(0);
            }

            .contextual-help-tooltip::before {
                content: '';
                position: absolute;
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                border: 6px solid transparent;
                border-top-color: #2c3e50;
            }

            .contextual-help-tooltip.top::before {
                top: -12px;
                border-top-color: transparent;
                border-bottom-color: #2c3e50;
            }

            .help-indicator {
                position: relative;
                display: inline-block;
                cursor: help;
            }

            .help-indicator::after {
                content: '?';
                position: absolute;
                top: -5px;
                right: -5px;
                background: #3498db;
                color: white;
                border-radius: 50%;
                width: 16px;
                height: 16px;
                font-size: 10px;
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0.7;
                transition: opacity 0.3s ease;
            }

            .help-indicator:hover::after {
                opacity: 1;
            }

            .guided-tour-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                z-index: 9999;
                display: none;
            }

            .guided-tour-popup {
                position: absolute;
                background: white;
                border-radius: 12px;
                padding: 20px;
                max-width: 400px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            }

            .guided-tour-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
            }

            .guided-tour-title {
                font-size: 18px;
                font-weight: 600;
                color: #2c3e50;
                margin: 0;
            }

            .guided-tour-close {
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: #7f8c8d;
            }

            .guided-tour-content {
                color: #5a6c7d;
                line-height: 1.6;
                margin-bottom: 20px;
            }

            .guided-tour-actions {
                display: flex;
                gap: 10px;
                justify-content: flex-end;
            }

            .guided-tour-btn {
                padding: 8px 16px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s ease;
            }

            .guided-tour-btn.primary {
                background: #3498db;
                color: white;
            }

            .guided-tour-btn.secondary {
                background: #ecf0f1;
                color: #2c3e50;
            }

            .guided-tour-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            }

            .help-highlight {
                position: relative;
                animation: helpPulse 2s infinite;
            }

            @keyframes helpPulse {
                0%, 100% { box-shadow: 0 0 0 0 rgba(52, 152, 219, 0.7); }
                50% { box-shadow: 0 0 0 10px rgba(52, 152, 219, 0); }
            }
        `;
        document.head.appendChild(style);
    }

    setupTooltips() {
        const tooltipData = this.getTooltipData();
        
        tooltipData.forEach(tooltip => {
            const element = document.querySelector(tooltip.selector);
            if (element) {
                this.addTooltip(element, tooltip);
            }
        });
    }

    getTooltipData() {
        return [
            {
                selector: '.btn-emergency',
                title: 'Emergency Delivery',
                content: 'Request immediate medical delivery for urgent situations. This will prioritize your request.'
            },
            {
                selector: '[href*="request-delivery"]',
                title: 'Request Delivery',
                content: 'Start a new medical delivery request. Fill in your location and required medications.'
            },
            {
                selector: '#tracking-map',
                title: 'Live Tracking',
                content: 'View real-time locations of nearby drones and track your deliveries in progress.'
            },
            {
                selector: '.social-link',
                title: 'Connect With Us',
                content: 'Follow us on social media for updates, health tips, and community support.'
            },
            {
                selector: '[href*="whatsapp"]',
                title: 'WhatsApp Support',
                content: 'Join our WhatsApp group for instant support and real-time delivery updates.'
            },
            {
                selector: '.quick-actions',
                title: 'Quick Actions',
                content: 'Access frequently used features like delivery requests, profile updates, and feedback.'
            }
        ];
    }

    addTooltip(element, tooltipData) {
        element.classList.add('help-indicator');
        
        element.addEventListener('mouseenter', (e) => {
            this.showTooltip(e.target, tooltipData);
        });

        element.addEventListener('mouseleave', () => {
            this.hideTooltip();
        });
    }

    showTooltip(element, tooltipData) {
        const tooltip = document.createElement('div');
        tooltip.className = 'contextual-help-tooltip';
        tooltip.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 5px;">${tooltipData.title}</div>
            <div>${tooltipData.content}</div>
        `;

        document.body.appendChild(tooltip);

        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        let top = rect.top - tooltipRect.height - 10;

        // Adjust position if tooltip goes off screen
        if (left < 10) left = 10;
        if (left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
        }
        if (top < 10) {
            top = rect.bottom + 10;
            tooltip.classList.add('top');
        }

        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';

        // Trigger animation
        setTimeout(() => tooltip.classList.add('show'), 10);

        this.currentTooltip = tooltip;
    }

    hideTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.classList.remove('show');
            setTimeout(() => {
                if (this.currentTooltip && this.currentTooltip.parentNode) {
                    this.currentTooltip.parentNode.removeChild(this.currentTooltip);
                }
                this.currentTooltip = null;
            }, 300);
        }
    }

    bindEvents() {
        // Close tooltips when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.contextual-help-tooltip')) {
                this.hideTooltip();
            }
        });

        // Close tooltips on scroll
        document.addEventListener('scroll', () => {
            this.hideTooltip();
        });
    }

    startGuidedTour() {
        const tourSteps = [
            {
                selector: '.btn-emergency',
                title: 'Emergency Delivery',
                content: 'For urgent medical needs, use this button to request immediate delivery with highest priority.'
            },
            {
                selector: '#tracking-map',
                title: 'Live Tracking',
                content: 'Monitor your deliveries in real-time and see nearby drones on this interactive map.'
            },
            {
                selector: '.social-media-section',
                title: 'Stay Connected',
                content: 'Follow us on social media and join our WhatsApp group for updates and support.'
            }
        ];

        this.showGuidedTourStep(tourSteps, 0);
    }

    showGuidedTourStep(steps, currentStep) {
        if (currentStep >= steps.length) return;

        const step = steps[currentStep];
        const element = document.querySelector(step.selector);
        
        if (!element) {
            this.showGuidedTourStep(steps, currentStep + 1);
            return;
        }

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'guided-tour-overlay';
        overlay.style.display = 'block';

        // Create popup
        const popup = document.createElement('div');
        popup.className = 'guided-tour-popup';
        popup.innerHTML = `
            <div class="guided-tour-header">
                <h3 class="guided-tour-title">${step.title}</h3>
                <button class="guided-tour-close">&times;</button>
            </div>
            <div class="guided-tour-content">
                ${step.content}
            </div>
            <div class="guided-tour-actions">
                <button class="guided-tour-btn secondary">Skip Tour</button>
                <button class="guided-tour-btn primary">${currentStep === steps.length - 1 ? 'Finish' : 'Next'}</button>
            </div>
        `;

        overlay.appendChild(popup);
        document.body.appendChild(overlay);

        // Position popup near element
        const rect = element.getBoundingClientRect();
        popup.style.left = Math.max(20, rect.left - 100) + 'px';
        popup.style.top = Math.max(20, rect.top - 150) + 'px';

        // Highlight element
        element.classList.add('help-highlight');

        // Bind events
        popup.querySelector('.guided-tour-close').onclick = () => {
            this.endGuidedTour(overlay, element);
        };

        popup.querySelector('.guided-tour-btn.secondary').onclick = () => {
            this.endGuidedTour(overlay, element);
        };

        popup.querySelector('.guided-tour-btn.primary').onclick = () => {
            this.endGuidedTour(overlay, element);
            this.showGuidedTourStep(steps, currentStep + 1);
        };

        overlay.onclick = (e) => {
            if (e.target === overlay) {
                this.endGuidedTour(overlay, element);
            }
        };
    }

    endGuidedTour(overlay, element) {
        if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
        if (element) {
            element.classList.remove('help-highlight');
        }
    }
}

// Initialize contextual help when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.body.dataset.userRole || window.location.pathname !== '/login') {
        if (typeof window.contextualHelpInstance === 'undefined') {
            window.contextualHelpInstance = new window.ContextualHelp();
        }
    }
});