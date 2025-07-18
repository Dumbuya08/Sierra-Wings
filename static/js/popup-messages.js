/**
 * SierraWings Popup Message System
 * Handles all popup notifications, alerts, and messages throughout the app
 */

class PopupMessageSystem {
    constructor() {
        this.messageQueue = [];
        this.isShowing = false;
        this.currentMessage = null;
        this.init();
    }

    init() {
        // Create message container
        this.createMessageContainer();
        
        // Listen for flash messages from Flask
        this.processFlashMessages();
        
        // Set up global error handling
        this.setupGlobalErrorHandling();
    }

    createMessageContainer() {
        if (document.getElementById('popup-message-container')) return;

        const container = document.createElement('div');
        container.id = 'popup-message-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            max-width: 400px;
            width: 100%;
        `;
        document.body.appendChild(container);
    }

    processFlashMessages() {
        // Process Flask flash messages
        const flashMessages = document.querySelectorAll('.alert[data-flash]');
        flashMessages.forEach(message => {
            const type = message.classList.contains('alert-success') ? 'success' :
                        message.classList.contains('alert-danger') ? 'error' :
                        message.classList.contains('alert-warning') ? 'warning' : 'info';
            
            this.showMessage(message.textContent.trim(), type, 6000);
            message.remove();
        });
    }

    setupGlobalErrorHandling() {
        // Handle AJAX errors
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.showMessage('An unexpected error occurred. Please try again.', 'error');
        });

        // Handle JavaScript errors
        window.addEventListener('error', (event) => {
            console.error('JavaScript error:', event.error);
            // Don't show popup for every JS error to avoid spam
        });
    }

    showMessage(text, type = 'info', duration = 5000, options = {}) {
        const message = {
            id: Date.now() + Math.random(),
            text: text,
            type: type,
            duration: duration,
            dismissible: options.dismissible !== false,
            persistent: options.persistent === true,
            action: options.action || null
        };

        this.messageQueue.push(message);
        this.processQueue();
    }

    processQueue() {
        if (this.isShowing || this.messageQueue.length === 0) return;

        this.isShowing = true;
        const message = this.messageQueue.shift();
        this.displayMessage(message);
    }

    displayMessage(message) {
        const container = document.getElementById('popup-message-container');
        const messageElement = this.createMessageElement(message);
        
        container.appendChild(messageElement);
        
        // Animate in
        requestAnimationFrame(() => {
            messageElement.style.transform = 'translateX(0)';
            messageElement.style.opacity = '1';
        });

        // Auto-dismiss if not persistent
        if (!message.persistent && message.duration > 0) {
            setTimeout(() => {
                this.dismissMessage(message.id);
            }, message.duration);
        }

        this.currentMessage = message;
    }

    createMessageElement(message) {
        const element = document.createElement('div');
        element.id = `popup-message-${message.id}`;
        element.className = `popup-message popup-message-${message.type}`;
        
        const iconMap = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        element.innerHTML = `
            <div class="popup-message-content">
                <div class="popup-message-icon">
                    <i class="${iconMap[message.type] || iconMap.info}"></i>
                </div>
                <div class="popup-message-text">${message.text}</div>
                ${message.dismissible ? `
                    <button class="popup-message-close" onclick="popupMessages.dismissMessage('${message.id}')">
                        <i class="fas fa-times"></i>
                    </button>
                ` : ''}
            </div>
            ${message.action ? `
                <div class="popup-message-actions">
                    <button class="popup-message-action" onclick="${message.action.callback}">
                        ${message.action.text}
                    </button>
                </div>
            ` : ''}
        `;

        // Add styles
        element.style.cssText = `
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.3s ease;
            margin-bottom: 10px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            border-left: 4px solid ${this.getTypeColor(message.type)};
            overflow: hidden;
        `;

        return element;
    }

    getTypeColor(type) {
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        return colors[type] || colors.info;
    }

    dismissMessage(messageId) {
        const element = document.getElementById(`popup-message-${messageId}`);
        if (!element) return;

        // Animate out
        element.style.transform = 'translateX(100%)';
        element.style.opacity = '0';

        setTimeout(() => {
            element.remove();
            this.isShowing = false;
            this.currentMessage = null;
            this.processQueue();
        }, 300);
    }

    showSuccess(text, duration = 5000) {
        this.showMessage(text, 'success', duration);
    }

    showError(text, duration = 8000) {
        this.showMessage(text, 'error', duration);
    }

    showWarning(text, duration = 6000) {
        this.showMessage(text, 'warning', duration);
    }

    showInfo(text, duration = 5000) {
        this.showMessage(text, 'info', duration);
    }

    showConfirm(text, onConfirm, onCancel = null) {
        this.showMessage(text, 'warning', 0, {
            persistent: true,
            action: {
                text: 'Confirm',
                callback: `popupMessages.handleConfirm('${onConfirm}', '${onCancel || ''}')`
            }
        });
    }

    handleConfirm(onConfirm, onCancel) {
        // Execute confirm callback
        if (onConfirm && typeof window[onConfirm] === 'function') {
            window[onConfirm]();
        }
        
        // Dismiss current message
        if (this.currentMessage) {
            this.dismissMessage(this.currentMessage.id);
        }
    }

    clearAll() {
        const container = document.getElementById('popup-message-container');
        if (container) {
            container.innerHTML = '';
        }
        this.messageQueue = [];
        this.isShowing = false;
        this.currentMessage = null;
    }
}

// Add CSS styles
const popupStyles = document.createElement('style');
popupStyles.textContent = `
    .popup-message-content {
        display: flex;
        align-items: center;
        padding: 15px;
        position: relative;
    }

    .popup-message-icon {
        margin-right: 12px;
        font-size: 1.2rem;
    }

    .popup-message-success .popup-message-icon {
        color: #28a745;
    }

    .popup-message-error .popup-message-icon {
        color: #dc3545;
    }

    .popup-message-warning .popup-message-icon {
        color: #ffc107;
    }

    .popup-message-info .popup-message-icon {
        color: #17a2b8;
    }

    .popup-message-text {
        flex: 1;
        font-size: 14px;
        line-height: 1.4;
        color: #333;
    }

    .popup-message-close {
        background: none;
        border: none;
        color: #999;
        cursor: pointer;
        font-size: 16px;
        padding: 0;
        margin-left: 10px;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .popup-message-close:hover {
        color: #333;
    }

    .popup-message-actions {
        padding: 0 15px 15px;
        border-top: 1px solid #eee;
        padding-top: 10px;
    }

    .popup-message-action {
        background: #007bff;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
    }

    .popup-message-action:hover {
        background: #0056b3;
    }

    @media (max-width: 768px) {
        #popup-message-container {
            right: 10px;
            left: 10px;
            max-width: none;
        }
    }
`;
document.head.appendChild(popupStyles);

// Global instance
window.popupMessages = new PopupMessageSystem();

// Export for use in other scripts
window.PopupMessageSystem = PopupMessageSystem;