/**
 * Floating Feedback Button for SierraWings
 * Movable emoji feedback that routes to sierrawingsofficial@gmail.com
 */

class FloatingFeedback {
    constructor() {
        this.button = null;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.autoDeleteTimeout = null;
        this.init();
    }

    init() {
        this.createButton();
        this.attachEventListeners();
    }

    createButton() {
        this.button = document.createElement('div');
        this.button.id = 'floating-feedback-btn';
        this.button.className = 'floating-feedback-button';
        this.button.innerHTML = `
            <div class="feedback-icon">
                <i class="fas fa-comment-dots"></i>
            </div>
            <div class="feedback-tooltip" style="display: none;">Quick Feedback</div>
        `;

        // Position button
        this.button.style.position = 'fixed';
        this.button.style.bottom = '20px';
        this.button.style.right = '20px';
        this.button.style.zIndex = '9999';
        this.button.style.cursor = 'grab';
        this.button.style.display = 'none'; // Hidden by user request

        // Add styles
        this.addStyles();
        
        document.body.appendChild(this.button);
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .floating-feedback-button {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #28a745, #20c997);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
                transition: all 0.3s ease;
                user-select: none;
                position: relative;
            }

            .floating-feedback-button:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
            }

            .floating-feedback-button.dragging {
                cursor: grabbing;
                transform: scale(0.9);
            }

            .feedback-icon {
                color: white;
                font-size: 1.5rem;
                transition: transform 0.3s ease;
            }

            .floating-feedback-button:hover .feedback-icon {
                transform: rotate(15deg);
            }

            .feedback-tooltip {
                position: absolute;
                bottom: 70px;
                right: 0;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 0.8rem;
                white-space: nowrap;
                opacity: 0;
                transform: translateY(10px);
                transition: all 0.3s ease;
                pointer-events: none;
            }

            .floating-feedback-button:hover .feedback-tooltip {
                opacity: 1;
                transform: translateY(0);
            }

            .emoji-feedback-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            }

            .emoji-feedback-content {
                background: white;
                padding: 30px;
                border-radius: 16px;
                text-align: center;
                max-width: 400px;
                width: 90%;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            }

            .emoji-feedback-title {
                font-size: 1.5rem;
                margin-bottom: 20px;
                color: #333;
            }

            .emoji-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 15px;
                margin-bottom: 20px;
            }

            .emoji-option {
                background: #f8f9fa;
                border: 2px solid transparent;
                border-radius: 12px;
                padding: 15px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
            }

            .emoji-option:hover {
                background: #e9ecef;
                border-color: #28a745;
                transform: translateY(-2px);
            }

            .emoji-option.selected {
                background: #d4edda;
                border-color: #28a745;
            }

            .emoji-option .emoji {
                font-size: 2rem;
            }

            .emoji-option .label {
                font-size: 0.9rem;
                color: #666;
                font-weight: 500;
            }

            .feedback-textarea {
                width: 100%;
                min-height: 80px;
                padding: 12px;
                border: 1px solid #ddd;
                border-radius: 8px;
                resize: vertical;
                font-family: inherit;
                margin-bottom: 20px;
            }

            .feedback-buttons {
                display: flex;
                gap: 10px;
                justify-content: center;
            }

            .feedback-btn {
                padding: 10px 20px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.3s ease;
            }

            .feedback-btn.primary {
                background: #28a745;
                color: white;
            }

            .feedback-btn.primary:hover {
                background: #218838;
            }

            .feedback-btn.secondary {
                background: #6c757d;
                color: white;
            }

            .feedback-btn.secondary:hover {
                background: #5a6268;
            }

            .feedback-success {
                color: #28a745;
                font-weight: 500;
                margin-top: 10px;
            }

            @media (max-width: 768px) {
                .floating-feedback-button {
                    width: 50px;
                    height: 50px;
                    bottom: 15px;
                    right: 15px;
                }

                .feedback-icon {
                    font-size: 1.2rem;
                }

                .emoji-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
            }
        `;
        document.head.appendChild(style);
    }

    attachEventListeners() {
        // Click to open feedback modal
        this.button.addEventListener('click', (e) => {
            if (!this.isDragging) {
                this.showFeedbackModal();
            }
        });

        // Mouse events for dragging
        this.button.addEventListener('mousedown', (e) => {
            this.startDragging(e);
        });

        document.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                this.drag(e);
            }
        });

        document.addEventListener('mouseup', () => {
            this.stopDragging();
        });

        // Touch events for mobile
        this.button.addEventListener('touchstart', (e) => {
            this.startDragging(e.touches[0]);
        });

        document.addEventListener('touchmove', (e) => {
            if (this.isDragging) {
                e.preventDefault();
                this.drag(e.touches[0]);
            }
        });

        document.addEventListener('touchend', () => {
            this.stopDragging();
        });
    }

    startDragging(e) {
        this.isDragging = true;
        this.button.classList.add('dragging');
        
        const rect = this.button.getBoundingClientRect();
        this.dragOffset = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    drag(e) {
        if (!this.isDragging) return;

        const x = e.clientX - this.dragOffset.x;
        const y = e.clientY - this.dragOffset.y;

        // Keep button within viewport
        const maxX = window.innerWidth - this.button.offsetWidth;
        const maxY = window.innerHeight - this.button.offsetHeight;

        const clampedX = Math.max(0, Math.min(x, maxX));
        const clampedY = Math.max(0, Math.min(y, maxY));

        this.button.style.left = clampedX + 'px';
        this.button.style.top = clampedY + 'px';
        this.button.style.right = 'auto';
        this.button.style.bottom = 'auto';
    }

    stopDragging() {
        this.isDragging = false;
        this.button.classList.remove('dragging');
    }

    showFeedbackModal() {
        const modal = document.createElement('div');
        modal.className = 'emoji-feedback-modal';
        modal.innerHTML = `
            <div class="emoji-feedback-content">
                <h3 class="emoji-feedback-title">How was your experience?</h3>
                <div class="emoji-grid">
                    <div class="emoji-option" data-rating="5">
                        <div class="emoji">😍</div>
                        <div class="label">Excellent</div>
                    </div>
                    <div class="emoji-option" data-rating="4">
                        <div class="emoji">😊</div>
                        <div class="label">Good</div>
                    </div>
                    <div class="emoji-option" data-rating="3">
                        <div class="emoji">😐</div>
                        <div class="label">Okay</div>
                    </div>
                    <div class="emoji-option" data-rating="2">
                        <div class="emoji">😕</div>
                        <div class="label">Poor</div>
                    </div>
                    <div class="emoji-option" data-rating="1">
                        <div class="emoji">😢</div>
                        <div class="label">Bad</div>
                    </div>
                    <div class="emoji-option" data-rating="0">
                        <div class="emoji">🐛</div>
                        <div class="label">Bug Report</div>
                    </div>
                </div>
                <textarea class="feedback-textarea" placeholder="Tell us more about your experience (optional)..."></textarea>
                <div class="feedback-buttons">
                    <button class="feedback-btn secondary" onclick="this.closest('.emoji-feedback-modal').remove()">Cancel</button>
                    <button class="feedback-btn primary" onclick="floatingFeedback.submitFeedback(this)">Send Feedback</button>
                </div>
                <div class="feedback-success" style="display: none;">Thank you! Your feedback has been sent.</div>
            </div>
        `;

        // Add emoji selection handling
        modal.querySelectorAll('.emoji-option').forEach(option => {
            option.addEventListener('click', () => {
                modal.querySelectorAll('.emoji-option').forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
            });
        });

        document.body.appendChild(modal);
    }

    async submitFeedback(button) {
        const modal = button.closest('.emoji-feedback-modal');
        const selectedEmoji = modal.querySelector('.emoji-option.selected');
        const textarea = modal.querySelector('.feedback-textarea');
        const successMsg = modal.querySelector('.feedback-success');

        if (!selectedEmoji) {
            alert('Please select a rating first!');
            return;
        }

        const rating = selectedEmoji.dataset.rating;
        const emojiText = selectedEmoji.querySelector('.emoji').textContent;
        const labelText = selectedEmoji.querySelector('.label').textContent;
        const comments = textarea.value.trim();

        try {
            const response = await fetch('/api/feedback/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    rating: rating,
                    emoji: emojiText,
                    label: labelText,
                    comments: comments,
                    source: 'floating_feedback'
                })
            });

            if (response.ok) {
                successMsg.style.display = 'block';
                button.style.display = 'none';
                modal.querySelector('.feedback-btn.secondary').textContent = 'Close';
                
                // Auto-delete after 1 minute
                this.autoDeleteTimeout = setTimeout(() => {
                    modal.remove();
                }, 60000);
            } else {
                alert('Error sending feedback. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Error sending feedback. Please try again.');
        }
    }
}

// Initialize floating feedback when DOM is loaded - DISABLED BY USER REQUEST
// document.addEventListener('DOMContentLoaded', function() {
//     // Only initialize if user is authenticated and not on auth pages
//     const userRole = document.body.dataset.userRole;
//     const isAuthPage = window.location.pathname.includes('/auth/');
//     
//     if (userRole !== 'guest' && !isAuthPage) {
//         window.floatingFeedback = new FloatingFeedback();
//     }
// });