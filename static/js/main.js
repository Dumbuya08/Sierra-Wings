/**
 * SierraWings Main JavaScript Functions
 * Handles common functionality across all pages
 */

// Global application state
window.SierraWings = {
    currentUser: null,
    isAuthenticated: false,
    userRole: null
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupGlobalEventHandlers();
    setupFormValidation();
    setupAjaxErrorHandling();
});

function initializeApp() {
    // Get user info from meta tags if available
    const userMeta = document.querySelector('meta[name="user-info"]');
    if (userMeta) {
        const userInfo = JSON.parse(userMeta.content);
        SierraWings.currentUser = userInfo;
        SierraWings.isAuthenticated = true;
        SierraWings.userRole = userInfo.role;
    }
    
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

function setupGlobalEventHandlers() {
    // Handle all form submissions with toast notifications
    document.addEventListener('submit', function(e) {
        const form = e.target;
        if (form.classList.contains('ajax-form')) {
            e.preventDefault();
            handleAjaxForm(form);
        }
    });
    
    // Handle all button clicks that should show loading states
    document.addEventListener('click', function(e) {
        const button = e.target.closest('.btn-loading');
        if (button) {
            showButtonLoading(button);
        }
    });
}

function setupFormValidation() {
    // Custom validation for all forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
                showError('Please fill in all required fields correctly.');
            }
            form.classList.add('was-validated');
        });
    });
}

function setupAjaxErrorHandling() {
    // Global AJAX error handler
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled promise rejection:', e.reason);
        showError('An unexpected error occurred. Please try again.');
    });
}

// Form handling functions
function handleAjaxForm(form) {
    const formData = new FormData(form);
    const url = form.action || window.location.href;
    const method = form.method || 'POST';
    
    fetch(url, {
        method: method,
        body: formData,
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSuccess(data.message || 'Operation completed successfully!');
            if (data.redirect) {
                setTimeout(() => {
                    window.location.href = data.redirect;
                }, 1000);
            }
        } else {
            showError(data.message || 'An error occurred. Please try again.');
        }
    })
    .catch(error => {
        console.error('Ajax form error:', error);
        showError('A network error occurred. Please check your connection and try again.');
    });
}

function showButtonLoading(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    button.disabled = true;
    
    // Re-enable after 5 seconds as fallback
    setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
    }, 5000);
}

// Toast notification convenience functions
function showSuccess(message, duration = 3000) {
    if (window.toastManager) {
        return window.toastManager.showSuccess(message, duration);
    }
    console.log('Success:', message);
}

function showInfo(message, duration = 4500) {
    if (window.toastManager) {
        return window.toastManager.showInfo(message, duration);
    }
    console.log('Info:', message);
}

function showWarning(message, duration = 4500) {
    if (window.toastManager) {
        return window.toastManager.showWarning(message, duration);
    }
    console.log('Warning:', message);
}

function showError(message, duration = 5000) {
    if (window.toastManager) {
        return window.toastManager.showError(message, duration);
    }
    console.error('Error:', message);
}

function showCritical(message) {
    if (window.toastManager) {
        return window.toastManager.showCritical(message);
    }
    console.error('Critical:', message);
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatCurrency(amount, currency = 'SLE') {
    return new Intl.NumberFormat('en-SL', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Network status handling
function checkNetworkStatus() {
    if (!navigator.onLine) {
        showWarning('You are currently offline. Some features may not work properly.');
    }
}

window.addEventListener('online', function() {
    showInfo('Connection restored!', 2000);
});

window.addEventListener('offline', function() {
    showWarning('You are now offline. Some features may not work properly.');
});

// User session management
function checkSessionStatus() {
    if (SierraWings.isAuthenticated) {
        fetch('/api/session/check', {
            method: 'GET',
            credentials: 'same-origin'
        })
        .then(response => response.json())
        .then(data => {
            if (!data.authenticated) {
                showCritical('Your session has expired. Please log in again.');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 3000);
            }
        })
        .catch(error => {
            console.error('Session check error:', error);
        });
    }
}

// Check session every 5 minutes
setInterval(checkSessionStatus, 5 * 60 * 1000);

// Initial network check
checkNetworkStatus();

// Export functions for global use
window.showSuccess = showSuccess;
window.showInfo = showInfo;
window.showWarning = showWarning;
window.showError = showError;
window.showCritical = showCritical;
window.formatDate = formatDate;
window.formatCurrency = formatCurrency;
window.debounce = debounce;