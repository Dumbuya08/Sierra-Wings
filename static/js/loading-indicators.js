/**
 * Animated Loading Indicators
 * Provides smooth loading animations for better user experience
 */

// Check if class already exists to prevent duplicate declarations
if (typeof window.LoadingIndicators === 'undefined') {
    window.LoadingIndicators = class LoadingIndicators {
    constructor() {
        this.init();
    }

    init() {
        this.createLoadingStyles();
        this.setupFormLoading();
        this.setupButtonLoading();
        this.setupPageLoading();
    }

    createLoadingStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .loading-spinner {
                display: inline-block;
                width: 20px;
                height: 20px;
                border: 2px solid #f3f3f3;
                border-top: 2px solid #3498db;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-right: 8px;
            }

            .loading-spinner.small {
                width: 16px;
                height: 16px;
                border-width: 2px;
            }

            .loading-spinner.large {
                width: 32px;
                height: 32px;
                border-width: 3px;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            .loading-dots {
                display: inline-block;
                position: relative;
                width: 40px;
                height: 20px;
                margin-right: 8px;
            }

            .loading-dots div {
                position: absolute;
                top: 8px;
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: #3498db;
                animation: loadingDots 1.2s linear infinite;
            }

            .loading-dots div:nth-child(1) { left: 6px; animation-delay: 0s; }
            .loading-dots div:nth-child(2) { left: 16px; animation-delay: -0.4s; }
            .loading-dots div:nth-child(3) { left: 26px; animation-delay: -0.8s; }

            @keyframes loadingDots {
                0%, 80%, 100% { transform: scale(0); }
                40% { transform: scale(1); }
            }

            .loading-pulse {
                display: inline-block;
                width: 20px;
                height: 20px;
                background: #3498db;
                border-radius: 50%;
                animation: pulse 1.5s ease-in-out infinite;
                margin-right: 8px;
            }

            @keyframes pulse {
                0% { transform: scale(0); opacity: 1; }
                100% { transform: scale(1); opacity: 0; }
            }

            .loading-wave {
                display: inline-block;
                width: 40px;
                height: 20px;
                margin-right: 8px;
            }

            .loading-wave div {
                display: inline-block;
                width: 4px;
                height: 100%;
                background: #3498db;
                margin: 0 1px;
                animation: wave 1.2s infinite ease-in-out;
            }

            .loading-wave div:nth-child(1) { animation-delay: -1.1s; }
            .loading-wave div:nth-child(2) { animation-delay: -1.0s; }
            .loading-wave div:nth-child(3) { animation-delay: -0.9s; }
            .loading-wave div:nth-child(4) { animation-delay: -0.8s; }
            .loading-wave div:nth-child(5) { animation-delay: -0.7s; }

            @keyframes wave {
                0%, 40%, 100% { transform: scaleY(0.4); }
                20% { transform: scaleY(1.0); }
            }

            .btn-loading {
                position: relative;
                pointer-events: none;
                opacity: 0.7;
            }

            .btn-loading .btn-text {
                visibility: hidden;
            }

            .btn-loading .btn-loading-spinner {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }

            .page-loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .page-loading-overlay.show {
                opacity: 1;
            }

            .page-loading-content {
                text-align: center;
                color: #2c3e50;
            }

            .page-loading-content h3 {
                margin: 20px 0 10px 0;
                font-size: 18px;
                font-weight: 600;
            }

            .page-loading-content p {
                margin: 0;
                color: #7f8c8d;
                font-size: 14px;
            }

            .loading-progress {
                width: 200px;
                height: 4px;
                background: #ecf0f1;
                border-radius: 2px;
                overflow: hidden;
                margin: 15px auto;
            }

            .loading-progress-bar {
                height: 100%;
                background: linear-gradient(90deg, #3498db, #2ecc71);
                border-radius: 2px;
                transform: translateX(-100%);
                animation: progressBar 2s ease-in-out infinite;
            }

            @keyframes progressBar {
                0% { transform: translateX(-100%); }
                50% { transform: translateX(0%); }
                100% { transform: translateX(100%); }
            }

            .form-loading {
                position: relative;
                overflow: hidden;
            }

            .form-loading::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                animation: formShimmer 1.5s infinite;
            }

            @keyframes formShimmer {
                0% { left: -100%; }
                100% { left: 100%; }
            }

            .card-loading {
                position: relative;
                overflow: hidden;
            }

            .card-loading::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(52,152,219,0.1), transparent);
                animation: cardShimmer 2s infinite;
            }

            @keyframes cardShimmer {
                0% { left: -100%; }
                100% { left: 100%; }
            }

            .skeleton-loading {
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: skeleton 1.5s infinite;
            }

            @keyframes skeleton {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }

            .medical-loading {
                display: inline-block;
                position: relative;
                width: 30px;
                height: 30px;
                margin-right: 10px;
            }

            .medical-loading::before {
                content: '⚕️';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 16px;
                animation: medicalPulse 1.5s infinite;
            }

            @keyframes medicalPulse {
                0%, 100% { transform: translate(-50%, -50%) scale(1); }
                50% { transform: translate(-50%, -50%) scale(1.2); }
            }

            .drone-loading {
                display: inline-block;
                position: relative;
                width: 30px;
                height: 30px;
                margin-right: 10px;
            }

            .drone-loading::before {
                content: '🚁';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 16px;
                animation: droneFloat 2s infinite ease-in-out;
            }

            @keyframes droneFloat {
                0%, 100% { transform: translate(-50%, -50%) translateY(0); }
                50% { transform: translate(-50%, -50%) translateY(-10px); }
            }
        `;
        document.head.appendChild(style);
    }

    setupFormLoading() {
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (form.tagName === 'FORM') {
                this.showFormLoading(form);
            }
        });
    }

    setupButtonLoading() {
        document.addEventListener('click', (e) => {
            const button = e.target.closest('button, .btn');
            if (button && button.type === 'submit') {
                this.showButtonLoading(button);
            }
        });
    }

    setupPageLoading() {
        // Show loading for page navigation
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href && !link.href.includes('#') && !link.target) {
                this.showPageLoading('Loading page...');
            }
        });
    }

    showSpinner(element, type = 'spinner', size = 'normal') {
        const spinnerElement = document.createElement('div');
        
        switch (type) {
            case 'dots':
                spinnerElement.className = 'loading-dots';
                spinnerElement.innerHTML = '<div></div><div></div><div></div>';
                break;
            case 'pulse':
                spinnerElement.className = 'loading-pulse';
                break;
            case 'wave':
                spinnerElement.className = 'loading-wave';
                spinnerElement.innerHTML = '<div></div><div></div><div></div><div></div><div></div>';
                break;
            case 'medical':
                spinnerElement.className = 'medical-loading';
                break;
            case 'drone':
                spinnerElement.className = 'drone-loading';
                break;
            default:
                spinnerElement.className = `loading-spinner ${size}`;
        }

        element.insertBefore(spinnerElement, element.firstChild);
        return spinnerElement;
    }

    showButtonLoading(button) {
        if (button.classList.contains('btn-loading')) return;

        button.classList.add('btn-loading');
        
        const originalText = button.innerHTML;
        const spinner = document.createElement('div');
        spinner.className = 'btn-loading-spinner';
        spinner.innerHTML = '<div class="loading-spinner small"></div>';
        
        button.innerHTML = '<span class="btn-text">' + originalText + '</span>';
        button.appendChild(spinner);

        // Auto-remove loading state after 5 seconds
        setTimeout(() => {
            this.hideButtonLoading(button, originalText);
        }, 5000);
    }

    hideButtonLoading(button, originalText) {
        button.classList.remove('btn-loading');
        button.innerHTML = originalText;
    }

    showFormLoading(form) {
        form.classList.add('form-loading');
        
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.disabled = true;
        });
    }

    hideFormLoading(form) {
        form.classList.remove('form-loading');
        
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.disabled = false;
        });
    }

    showPageLoading(message = 'Loading...') {
        const overlay = document.createElement('div');
        overlay.className = 'page-loading-overlay';
        overlay.innerHTML = `
            <div class="page-loading-content">
                <div class="medical-loading"></div>
                <h3>${message}</h3>
                <p>Please wait while we prepare your content</p>
                <div class="loading-progress">
                    <div class="loading-progress-bar"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Trigger animation
        setTimeout(() => overlay.classList.add('show'), 10);
        
        return overlay;
    }

    hidePageLoading(overlay) {
        if (overlay) {
            overlay.classList.remove('show');
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 300);
        }
    }

    showCardLoading(card) {
        card.classList.add('card-loading');
    }

    hideCardLoading(card) {
        card.classList.remove('card-loading');
    }

    showSkeletonLoading(element) {
        element.classList.add('skeleton-loading');
    }

    hideSkeletonLoading(element) {
        element.classList.remove('skeleton-loading');
    }
}

// Initialize loading indicators when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (typeof window.loadingIndicatorsInstance === 'undefined') {
        window.loadingIndicatorsInstance = new window.LoadingIndicators();
    }
});