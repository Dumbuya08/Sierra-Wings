// Theme Toggle System - DISABLED
class ThemeManager {
    constructor() {
        this.currentTheme = 'light'; // Always use light theme
        this.init();
    }

    init() {
        // Set light theme only
        this.setTheme('light');
        
        // Theme toggle disabled - no toggle button created
        // listenForSystemThemeChanges disabled
    }

    setTheme(theme) {
        this.currentTheme = 'light'; // Force light theme
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        
        // Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', '#ffffff');
        }
        
        // Trigger custom event for other components
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: 'light' } }));
    }

    // Theme toggle disabled
    toggleTheme() {
        // No functionality - theme toggle disabled
    }

    // Get current theme (always light)
    getTheme() {
        return 'light';
    }

    // Check if current theme is dark (always false)
    isDark() {
        return false;
    }
}

// Accessibility enhancements
class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        // Add keyboard navigation support
        this.addKeyboardSupport();
        
        // Add focus management
        this.addFocusManagement();
        
        // Add screen reader support
        this.addScreenReaderSupport();
    }

    addKeyboardSupport() {
        // Theme toggle disabled - no keyboard shortcut
        // Alt + T functionality removed per user request
    }

    addFocusManagement() {
        // Add focus styles for keyboard users
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    addScreenReaderSupport() {
        // Theme change announcements disabled
        // Only light theme is available
    }
}

// Enhanced animations and transitions
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.addPageTransitions();
        this.addCardAnimations();
        this.addScrollAnimations();
    }

    addPageTransitions() {
        // Add fade-in animation to page content
        document.addEventListener('DOMContentLoaded', () => {
            const main = document.querySelector('main') || document.body;
            main.classList.add('fade-in');
        });
    }

    addCardAnimations() {
        // Add hover animations to cards
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-4px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }

    addScrollAnimations() {
        // Add scroll-triggered animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        // Observe elements with animation class
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
    window.accessibilityManager = new AccessibilityManager();
    window.animationManager = new AnimationManager();
    
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add custom loading indicator
    const loadingIndicator = document.querySelector('.loading-indicator');
    if (loadingIndicator) {
        setTimeout(() => {
            loadingIndicator.style.opacity = '0';
            setTimeout(() => {
                loadingIndicator.remove();
            }, 300);
        }, 500);
    }
});

// Export for external use
window.ThemeManager = ThemeManager;
window.AccessibilityManager = AccessibilityManager;
window.AnimationManager = AnimationManager;