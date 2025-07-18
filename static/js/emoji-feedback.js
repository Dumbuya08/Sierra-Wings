/**
 * One-Click Emoji Feedback System
 * Provides quick feedback submission with emoji ratings
 */

class EmojieFeedback {
    constructor() {
        this.init();
    }

    init() {
        this.createFeedbackStyles();
        this.createFeedbackWidgets();
        this.setupEventListeners();
    }

    createFeedbackStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .emoji-feedback-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: white;
                border-radius: 50px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                padding: 10px 20px;
                display: flex;
                align-items: center;
                gap: 10px;
                z-index: 1000;
                transition: all 0.3s ease;
                border: 2px solid transparent;
            }

            .emoji-feedback-widget.expanded {
                border-radius: 25px;
                padding: 15px 25px;
                border-color: #3498db;
            }

            .emoji-feedback-trigger {
                background: linear-gradient(135deg, #3498db, #2980b9);
                color: white;
                border: none;
                border-radius: 25px;
                padding: 10px 15px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                transition: all 0.3s ease;
                box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
            }

            .emoji-feedback-trigger:hover {
                background: linear-gradient(135deg, #2980b9, #21618c);
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
            }

            .emoji-feedback-options {
                display: none;
                align-items: center;
                gap: 8px;
                margin-right: 10px;
            }

            .emoji-feedback-options.visible {
                display: flex;
                animation: slideIn 0.3s ease-out;
            }

            .emoji-option {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                padding: 5px;
                border-radius: 50%;
                transition: all 0.2s ease;
                position: relative;
            }

            .emoji-option:hover {
                transform: scale(1.2);
                background: #f8f9fa;
            }

            .emoji-option.selected {
                background: #3498db;
                transform: scale(1.1);
            }

            .emoji-option::after {
                content: attr(data-label);
                position: absolute;
                bottom: -25px;
                left: 50%;
                transform: translateX(-50%);
                background: #2c3e50;
                color: white;
                padding: 2px 8px;
                border-radius: 4px;
                font-size: 12px;
                white-space: nowrap;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.2s ease;
            }

            .emoji-option:hover::after {
                opacity: 1;
            }

            .quick-feedback-form {
                position: fixed;
                bottom: 80px;
                right: 20px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.2);
                padding: 20px;
                width: 300px;
                z-index: 1001;
                display: none;
                animation: slideUp 0.3s ease-out;
            }

            .quick-feedback-form.visible {
                display: block;
            }

            .quick-feedback-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
            }

            .quick-feedback-title {
                font-size: 16px;
                font-weight: 600;
                color: #2c3e50;
                margin: 0;
            }

            .quick-feedback-close {
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: #7f8c8d;
                padding: 0;
                line-height: 1;
            }

            .quick-feedback-close:hover {
                color: #2c3e50;
            }

            .selected-emoji-display {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 15px;
                padding: 10px;
                background: #f8f9fa;
                border-radius: 8px;
            }

            .selected-emoji {
                font-size: 24px;
            }

            .emoji-rating-text {
                font-size: 14px;
                color: #546e7a;
                font-weight: 500;
            }

            .quick-feedback-textarea {
                width: 100%;
                height: 60px;
                border: 1px solid #e0e0e0;
                border-radius: 6px;
                padding: 10px;
                font-size: 14px;
                resize: vertical;
                font-family: inherit;
                margin-bottom: 15px;
            }

            .quick-feedback-textarea:focus {
                outline: none;
                border-color: #3498db;
                box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
            }

            .quick-feedback-actions {
                display: flex;
                gap: 10px;
                justify-content: flex-end;
            }

            .quick-feedback-btn {
                padding: 8px 16px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.3s ease;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .quick-feedback-btn-primary {
                background: linear-gradient(135deg, #3498db, #2980b9);
                color: white;
            }

            .quick-feedback-btn-primary:hover {
                background: linear-gradient(135deg, #2980b9, #21618c);
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
            }

            .quick-feedback-btn-secondary {
                background: linear-gradient(135deg, #e9ecef, #dee2e6);
                color: #495057;
            }

            .quick-feedback-btn-secondary:hover {
                background: linear-gradient(135deg, #dee2e6, #ced4da);
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
            }

            .feedback-success-message {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #27ae60;
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                z-index: 1002;
                display: none;
                animation: slideDown 0.3s ease-out;
            }

            .feedback-success-message.visible {
                display: block;
            }

            .category-selector {
                display: flex;
                gap: 8px;
                margin-bottom: 15px;
                flex-wrap: wrap;
            }

            .category-option {
                padding: 6px 12px;
                background: #f8f9fa;
                border: 1px solid #e9ecef;
                border-radius: 20px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
                color: #6c757d;
            }

            .category-option:hover {
                background: #e9ecef;
            }

            .category-option.selected {
                background: #3498db;
                color: white;
                border-color: #3498db;
            }

            @keyframes slideIn {
                from { transform: translateX(20px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }

            @keyframes slideUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }

            @keyframes slideDown {
                from { transform: translateY(-20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    createFeedbackWidgets() {
        // Only create widget on non-auth pages
        if (this.isAuthPage()) {
            return;
        }

        // Create floating feedback widget (hidden by user request)
        const widget = document.createElement('div');
        widget.className = 'emoji-feedback-widget';
        widget.style.display = 'none'; // Hidden by user request
        widget.innerHTML = `
            <div class="emoji-feedback-options">
                <button class="emoji-option" data-rating="1" data-label="Very Bad">😞</button>
                <button class="emoji-option" data-rating="2" data-label="Bad">😐</button>
                <button class="emoji-option" data-rating="3" data-label="Okay">🙂</button>
                <button class="emoji-option" data-rating="4" data-label="Good">😊</button>
                <button class="emoji-option" data-rating="5" data-label="Excellent">😍</button>
            </div>
            <button class="emoji-feedback-trigger" style="display: none;">Quick Feedback</button>
        `;

        // Create feedback form
        const form = document.createElement('div');
        form.className = 'quick-feedback-form';
        form.innerHTML = `
            <div class="quick-feedback-header">
                <h3 class="quick-feedback-title">Share Your Feedback</h3>
                <button class="quick-feedback-close">&times;</button>
            </div>
            
            <div class="selected-emoji-display" style="display: none;">
                <span class="selected-emoji"></span>
                <span class="emoji-rating-text"></span>
            </div>
            
            <div class="category-selector">
                <div class="category-option" data-category="general">General</div>
                <div class="category-option" data-category="delivery">Delivery</div>
                <div class="category-option" data-category="interface">Interface</div>
                <div class="category-option" data-category="technical">Technical</div>
                <div class="category-option" data-category="suggestion">Suggestion</div>
            </div>
            
            <textarea class="quick-feedback-textarea" placeholder="Tell us more about your experience... (optional)"></textarea>
            
            <div class="quick-feedback-actions">
                <button class="quick-feedback-btn quick-feedback-btn-primary" data-action="submit">Send Feedback</button>
            </div>
        `;

        // Create success message
        const successMessage = document.createElement('div');
        successMessage.className = 'feedback-success-message';
        successMessage.innerHTML = `
            <strong>Thank you!</strong> Your feedback has been sent and will help improve SierraWings.
        `;

        document.body.appendChild(widget);
        document.body.appendChild(form);
        document.body.appendChild(successMessage);

        this.widget = widget;
        this.form = form;
        this.successMessage = successMessage;
    }

    isAuthPage() {
        const authPages = ['/login', '/register', '/verify-email', '/forgot-password'];
        return authPages.some(page => window.location.pathname.includes(page));
    }

    setupEventListeners() {
        if (!this.widget) return;

        const trigger = this.widget.querySelector('.emoji-feedback-trigger');
        const options = this.widget.querySelector('.emoji-feedback-options');
        const emojiButtons = this.widget.querySelectorAll('.emoji-option');
        const closeBtn = this.form.querySelector('.quick-feedback-close');
        const submitBtn = this.form.querySelector('[data-action="submit"]');
        const categoryOptions = this.form.querySelectorAll('.category-option');

        // Toggle emoji options
        trigger.addEventListener('click', () => {
            const isExpanded = options.classList.contains('visible');
            if (isExpanded) {
                this.hideOptions();
            } else {
                this.showOptions();
            }
        });

        // Handle emoji selection
        emojiButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const rating = button.dataset.rating;
                const emoji = button.textContent;
                const label = button.dataset.label;
                
                this.selectRating(rating, emoji, label);
                this.showForm();
            });
        });

        // Handle category selection
        categoryOptions.forEach(option => {
            option.addEventListener('click', () => {
                categoryOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
            });
        });

        // Handle form actions
        closeBtn.addEventListener('click', () => this.hideForm());
        submitBtn.addEventListener('click', () => this.submitFeedback());

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!this.widget.contains(e.target) && !this.form.contains(e.target)) {
                this.hideOptions();
                this.hideForm();
            }
        });
    }

    showOptions() {
        this.widget.classList.add('expanded');
        this.widget.querySelector('.emoji-feedback-options').classList.add('visible');
    }

    hideOptions() {
        this.widget.classList.remove('expanded');
        this.widget.querySelector('.emoji-feedback-options').classList.remove('visible');
    }

    selectRating(rating, emoji, label) {
        this.selectedRating = rating;
        this.selectedEmoji = emoji;
        this.selectedLabel = label;
        
        // Update form display
        const display = this.form.querySelector('.selected-emoji-display');
        const emojiSpan = this.form.querySelector('.selected-emoji');
        const textSpan = this.form.querySelector('.emoji-rating-text');
        
        emojiSpan.textContent = emoji;
        textSpan.textContent = label;
        display.style.display = 'flex';
        
        // Select first category by default
        const firstCategory = this.form.querySelector('.category-option');
        if (firstCategory) {
            firstCategory.classList.add('selected');
        }
    }

    showForm() {
        this.hideOptions();
        this.form.classList.add('visible');
        
        // Focus on textarea if no specific feedback needed
        if (this.selectedRating >= 3) {
            setTimeout(() => {
                this.form.querySelector('.quick-feedback-textarea').focus();
            }, 100);
        }
    }

    hideForm() {
        this.form.classList.remove('visible');
        this.resetForm();
    }

    resetForm() {
        this.form.querySelector('.quick-feedback-textarea').value = '';
        this.form.querySelector('.selected-emoji-display').style.display = 'none';
        this.form.querySelectorAll('.category-option').forEach(opt => opt.classList.remove('selected'));
        this.selectedRating = null;
        this.selectedEmoji = null;
        this.selectedLabel = null;
    }

    async submitFeedback() {
        const textarea = this.form.querySelector('.quick-feedback-textarea');
        const selectedCategory = this.form.querySelector('.category-option.selected');
        
        const feedbackData = {
            rating: this.selectedRating,
            emoji: this.selectedEmoji,
            category: selectedCategory ? selectedCategory.dataset.category : 'general',
            message: textarea.value.trim() || `${this.selectedLabel} experience`,
            timestamp: new Date().toISOString()
        };

        try {
            const response = await fetch('/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    subject: `Quick Feedback - ${this.selectedLabel}`,
                    message: feedbackData.message,
                    rating: feedbackData.rating,
                    category: feedbackData.category
                })
            });

            if (response.ok) {
                this.showSuccessMessage();
                this.hideForm();
            } else {
                throw new Error('Failed to submit feedback');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Failed to submit feedback. Please try again.');
        }
    }

    showSuccessMessage() {
        this.successMessage.classList.add('visible');
        setTimeout(() => {
            this.successMessage.classList.remove('visible');
        }, 4000);
    }
}

// Initialize emoji feedback system - DISABLED BY USER REQUEST
// document.addEventListener('DOMContentLoaded', function() {
//     window.emojiFeedback = new EmojieFeedback();
// });