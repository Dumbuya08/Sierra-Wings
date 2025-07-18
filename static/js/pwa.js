// PWA Installation and Management
class PWAManager {
    constructor() {
        this.deferredPrompt = null;
        this.init();
    }

    init() {
        // Listen for beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            
            // Stash the event so it can be triggered later
            this.deferredPrompt = e;
            
            // Show the install button
            this.showInstallButton();
        });

        // Listen for install button click
        const installButton = document.getElementById('pwa-install');
        if (installButton) {
            installButton.addEventListener('click', () => {
                this.installPWA();
            });
        }

        // Listen for app installed event
        window.addEventListener('appinstalled', (evt) => {
            console.log('PWA installed successfully');
            this.hideInstallButton();
        });

        // Check if app is already installed
        this.checkIfInstalled();
        
        // Create install button
        this.createInstallButton();
    }

    showInstallButton() {
        const installButton = document.getElementById('pwa-install');
        if (installButton) {
            installButton.style.display = 'flex';
        }
    }

    hideInstallButton() {
        const installButton = document.getElementById('pwa-install');
        if (installButton) {
            installButton.style.display = 'none';
        }
    }

    async installPWA() {
        if (!this.deferredPrompt) {
            console.log('No install prompt available');
            // Show manual install instructions for iOS
            this.showManualInstallInstructions();
            return;
        }

        // Show the install prompt
        this.deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await this.deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }

        // Clear the deferredPrompt
        this.deferredPrompt = null;
        this.hideInstallButton();
    }
    
    showManualInstallInstructions() {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isAndroid = /Android/.test(navigator.userAgent);
        
        let instructions = '';
        if (isIOS) {
            instructions = 'To install this app on iOS:\n1. Tap the Share button\n2. Tap "Add to Home Screen"\n3. Tap "Add"';
        } else if (isAndroid) {
            instructions = 'To install this app on Android:\n1. Tap the menu (⋮)\n2. Tap "Add to Home screen"\n3. Tap "Add"';
        } else {
            instructions = 'To install this app:\n1. Look for the install icon in your browser\n2. Click "Install" or "Add to Home Screen"';
        }
        
        alert(instructions);
    }
    
    createInstallButton() {
        // Only create if doesn't exist
        if (document.getElementById('pwa-install')) {
            return;
        }
        
        const installButton = document.createElement('button');
        installButton.id = 'pwa-install';
        installButton.className = 'btn btn-success btn-lg pwa-install-btn';
        installButton.innerHTML = '<i class="fas fa-download me-2"></i>Install App';
        installButton.style.display = 'none';
        installButton.style.marginTop = '10px';
        
        // Add to hero section if it exists
        const heroSection = document.querySelector('.hero-section .d-flex.gap-3');
        if (heroSection) {
            heroSection.appendChild(installButton);
        }
        
        // Add event listener
        installButton.addEventListener('click', () => {
            this.installPWA();
        });
        
        return installButton;
    }

    checkIfInstalled() {
        // Check if running in standalone mode (PWA installed)
        if (window.matchMedia('(display-mode: standalone)').matches) {
            this.hideInstallButton();
        }

        // Check if running in PWA mode on iOS
        if (window.navigator.standalone === true) {
            this.hideInstallButton();
        }
    }
}

// Initialize PWA Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if ('serviceWorker' in navigator) {
        // Register service worker
        navigator.serviceWorker.register('/static/sw.js')
            .then((registration) => {
                console.log('Service Worker registered successfully:', registration);
            })
            .catch((error) => {
                console.log('Service Worker registration failed:', error);
            });
    }

    // Initialize PWA Manager
    new PWAManager();
});