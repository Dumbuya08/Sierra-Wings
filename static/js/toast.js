/**
 * SierraWings Toast Notification System
 * Provides automatic popup messages with specified timing behaviors
 */

class ToastManager {
    constructor() {
        this.container = null;
        this.toasts = new Map();
        this.init();
    }

    init() {
        // Create toast container if it doesn't exist
        this.container = document.querySelector('.toast-container');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container position-fixed top-0 end-0 p-3';
            this.container.style.zIndex = '9999';
            document.body.appendChild(this.container);
        }

        // Listen for flash messages from server and convert them to toasts
        this.convertFlashMessages();
    }

    convertFlashMessages() {
        const flashMessages = document.querySelectorAll('.alert');
        flashMessages.forEach(alert => {
            const message = alert.textContent.trim();
            const category = this.getFlashCategory(alert.className);
            
            // Hide the original flash message
            alert.style.display = 'none';
            
            // Show as toast
            this.showToast(message, category);
        });
    }

    getFlashCategory(className) {
        if (className.includes('alert-success')) return 'success';
        if (className.includes('alert-info')) return 'info';
        if (className.includes('alert-warning')) return 'warning';
        if (className.includes('alert-danger')) return 'error';
        return 'info';
    }

    showToast(message, type = 'info', duration = null) {
        const toastId = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        
        // Set default durations based on type
        if (duration === null) {
            switch (type) {
                case 'success':
                    duration = 3000;
                    break;
                case 'info':
                    duration = 4500;
                    break;
                case 'warning':
                    duration = 4500;
                    break;
                case 'error':
                    duration = 5000;
                    break;
                case 'critical':
                    duration = 0; // Persistent - manual dismiss only
                    break;
                default:
                    duration = 4000;
            }
        }

        const toast = this.createToastElement(toastId, message, type, duration);
        this.container.appendChild(toast);

        // Show the toast
        const bsToast = new bootstrap.Toast(toast, {
            autohide: duration > 0,
            delay: duration
        });

        // Store reference
        this.toasts.set(toastId, {
            element: toast,
            bootstrap: bsToast,
            type: type,
            duration: duration
        });

        bsToast.show();

        // Auto-remove after hide (if not persistent)
        if (duration > 0) {
            setTimeout(() => {
                this.removeToast(toastId);
            }, duration + 500);
        }

        return toastId;
    }

    createToastElement(id, message, type, duration) {
        const toast = document.createElement('div');
        toast.id = id;
        toast.className = `toast ${this.getToastClass(type)}`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');

        const icon = this.getIcon(type);
        const closeButton = duration === 0 ? 
            '<button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>' : 
            '';

        toast.innerHTML = `
            <div class="toast-body">
                <i class="${icon}"></i>
                ${message}
                ${closeButton}
            </div>
        `;

        // Add event listener for manual close
        const closeBtn = toast.querySelector('.btn-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.removeToast(id);
            });
        }

        return toast;
    }

    getToastClass(type) {
        const classes = {
            'success': 'bg-success text-white',
            'info': 'bg-info text-white',
            'warning': 'bg-warning text-dark',
            'error': 'bg-danger text-white',
            'critical': 'bg-danger text-white border-warning'
        };
        return classes[type] || 'bg-info text-white';
    }

    getIcon(type) {
        const icons = {
            'success': 'fas fa-check-circle',
            'info': 'fas fa-info-circle',
            'warning': 'fas fa-exclamation-triangle',
            'error': 'fas fa-exclamation-circle',
            'critical': 'fas fa-exclamation-triangle'
        };
        return icons[type] || 'fas fa-info-circle';
    }

    removeToast(toastId) {
        const toastData = this.toasts.get(toastId);
        if (toastData) {
            toastData.element.remove();
            this.toasts.delete(toastId);
        }
    }

    // Convenience methods for different toast types
    showSuccess(message, duration = 3000) {
        return this.showToast(message, 'success', duration);
    }

    showInfo(message, duration = 4500) {
        return this.showToast(message, 'info', duration);
    }

    showWarning(message, duration = 4500) {
        return this.showToast(message, 'warning', duration);
    }

    showError(message, duration = 5000) {
        return this.showToast(message, 'error', duration);
    }

    showCritical(message) {
        return this.showToast(message, 'critical', 0);
    }

    // Clear all toasts
    clearAll() {
        this.toasts.forEach((toastData, toastId) => {
            this.removeToast(toastId);
        });
    }

    // Clear toasts by type
    clearByType(type) {
        this.toasts.forEach((toastData, toastId) => {
            if (toastData.type === type) {
                this.removeToast(toastId);
            }
        });
    }
}

// Initialize toast manager when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.toastManager = new ToastManager();
});

// Export for use in other scripts
window.ToastManager = ToastManager;