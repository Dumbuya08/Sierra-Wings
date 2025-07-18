/**
 * SierraWings Feedback System
 * AJAX feedback submission to SierraWingsOfficial@gmail.com
 */

class FeedbackSystem {
    constructor() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Handle feedback form submission
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'feedbackForm') {
                e.preventDefault();
                this.submitFeedback(e.target);
            }
        });

        // Handle quick feedback buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-feedback-btn')) {
                this.showQuickFeedbackModal(e.target.dataset.type);
            }
        });
    }

    async submitFeedback(form) {
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';

        try {
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message')
            };

            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                this.showSuccessMessage('Thank you for your feedback! We will review it soon.');
                form.reset();
            } else {
                this.showErrorMessage(result.error || 'Failed to send feedback');
            }
        } catch (error) {
            this.showErrorMessage('Network error. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    }

    showQuickFeedbackModal(type) {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'quickFeedbackModal';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Quick Feedback</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="quickFeedbackForm">
                            <div class="mb-3">
                                <label for="quickName" class="form-label">Your Name</label>
                                <input type="text" class="form-control" id="quickName" name="name" required>
                            </div>
                            <div class="mb-3">
                                <label for="quickEmail" class="form-label">Your Email</label>
                                <input type="email" class="form-control" id="quickEmail" name="email" required>
                            </div>
                            <div class="mb-3">
                                <label for="quickMessage" class="form-label">Message</label>
                                <textarea class="form-control" id="quickMessage" name="message" rows="3" required></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary">Send Feedback</button>
                        </form>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        // Remove modal when hidden
        modal.addEventListener('hidden.bs.modal', () => {
            document.body.removeChild(modal);
        });
    }

    showSuccessMessage(message) {
        this.showAlert(message, 'success');
    }

    showErrorMessage(message) {
        this.showAlert(message, 'danger');
    }

    showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; max-width: 400px;';
        alertDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        document.body.appendChild(alertDiv);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.parentNode.removeChild(alertDiv);
            }
        }, 5000);
    }
}

// Initialize feedback system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FeedbackSystem();
});

// Global function for quick feedback
window.submitQuickFeedback = async function(name, email, message) {
    try {
        const response = await fetch('/api/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, message })
        });

        const result = await response.json();
        
        if (result.success) {
            return { success: true, message: 'Feedback sent successfully!' };
        } else {
            return { success: false, error: result.error || 'Failed to send feedback' };
        }
    } catch (error) {
        return { success: false, error: 'Network error. Please try again.' };
    }
};