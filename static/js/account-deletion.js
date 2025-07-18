/**
 * Account Deletion Request JavaScript
 * Handles account deletion modal and requests
 */

// Global function to show account deletion modal
function showAccountDeletionModal() {
    const modal = new bootstrap.Modal(document.getElementById('accountDeletionModal'));
    modal.show();
}

// Account deletion functionality
document.addEventListener('DOMContentLoaded', function() {
    const deletionReasonSelect = document.getElementById('deletionReason');
    const otherReasonDiv = document.getElementById('otherReasonDiv');
    
    if (deletionReasonSelect) {
        deletionReasonSelect.addEventListener('change', function() {
            if (this.value === 'other') {
                otherReasonDiv.style.display = 'block';
            } else {
                otherReasonDiv.style.display = 'none';
            }
        });
    }
    
    // Check if user has pending deletion request
    checkDeletionStatus();
    
    // Add event listener to form submission
    const form = document.getElementById('accountDeletionForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            submitAccountDeletion();
        });
    }
});

function submitAccountDeletion() {
    const reason = document.getElementById('deletionReason').value;
    const otherReason = document.getElementById('otherReason').value;
    const feedback = document.getElementById('deletionFeedback').value;
    const password = document.getElementById('confirmPassword').value;
    const confirmDeletion = document.getElementById('confirmDeletion').checked;
    const dataExportRequest = document.getElementById('dataExportRequest').checked;
    
    if (!reason || !password || !confirmDeletion) {
        showMessage('Please fill in all required fields and confirm your decision.', 'error');
        return;
    }
    
    const finalReason = reason === 'other' ? otherReason : reason;
    
    // Show loading state
    const submitButton = document.querySelector('#accountDeletionForm button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Submitting...';
    submitButton.disabled = true;
    
    fetch('/request-account-deletion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            reason: finalReason,
            feedback: feedback,
            password: password,
            data_export_request: dataExportRequest
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showMessage('Account deletion request submitted successfully. You will be notified when your request is processed.', 'success');
            bootstrap.Modal.getInstance(document.getElementById('accountDeletionModal')).hide();
            setTimeout(() => {
                location.reload();
            }, 2000);
        } else {
            showMessage('Error: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage('An error occurred while submitting your request.', 'error');
    })
    .finally(() => {
        // Reset button state
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    });
}

function checkDeletionStatus() {
    fetch('/account-deletion-status')
        .then(response => response.json())
        .then(data => {
            if (data.success && data.has_pending_request) {
                showDeletionStatus(data.request_date);
            }
        })
        .catch(error => {
            console.error('Error checking deletion status:', error);
        });
}

function showDeletionStatus(requestDate) {
    const statusDiv = document.getElementById('deletionStatus');
    const dateSpan = document.getElementById('deletionRequestDate');
    
    if (statusDiv && dateSpan) {
        dateSpan.textContent = new Date(requestDate).toLocaleString();
        statusDiv.style.display = 'block';
    }
}

function cancelDeletionRequest() {
    if (confirm('Are you sure you want to cancel your account deletion request?')) {
        fetch('/cancel-account-deletion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showMessage('Account deletion request cancelled successfully.', 'success');
                document.getElementById('deletionStatus').style.display = 'none';
            } else {
                showMessage('Error: ' + data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage('An error occurred while cancelling your request.', 'error');
        });
    }
}

function showMessage(message, type) {
    // Use popup message system if available
    if (window.popupMessages) {
        if (type === 'success') {
            window.popupMessages.showSuccess(message);
        } else if (type === 'error') {
            window.popupMessages.showError(message);
        } else {
            window.popupMessages.showInfo(message);
        }
    } else {
        // Fallback to alert
        alert(message);
    }
}