/**
 * Maintenance Mode Checker for SierraWings
 * Checks for maintenance mode every 30 seconds and shows banner
 */

// Check if already initialized to prevent duplicate declarations
if (typeof window.maintenanceCheckInterval === 'undefined') {
    window.maintenanceCheckInterval = null;
    window.maintenanceBanner = null;

    // Initialize maintenance checker
    document.addEventListener('DOMContentLoaded', function() {
        checkMaintenanceStatus();
        
        // Check every 30 seconds
        window.maintenanceCheckInterval = setInterval(checkMaintenanceStatus, 30000);
    });
}

function checkMaintenanceStatus() {
    fetch('/api/maintenance/check')
        .then(response => response.json())
        .then(data => {
            if (data.maintenance_mode) {
                showMaintenanceBanner(data.message);
            } else {
                hideMaintenanceBanner();
            }
        })
        .catch(error => {
            console.error('Error checking maintenance status:', error);
        });
}

function showMaintenanceBanner(message) {
    if (window.maintenanceBanner) {
        return; // Banner already exists
    }
    
    window.maintenanceBanner = document.createElement('div');
    window.maintenanceBanner.className = 'maintenance-banner';
    window.maintenanceBanner.innerHTML = `
        <div class="maintenance-content">
            <div class="maintenance-icon">
                <i class="fas fa-tools"></i>
            </div>
            <div class="maintenance-text">
                <h3>System Maintenance</h3>
                <p>${message}</p>
            </div>
            <div class="maintenance-close" onclick="hideMaintenanceBanner()">
                <i class="fas fa-times"></i>
            </div>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .maintenance-banner {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
            backdrop-filter: blur(5px);
        }
        
        .maintenance-content {
            background: #fff;
            padding: 40px;
            border-radius: 16px;
            text-align: center;
            max-width: 500px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            position: relative;
        }
        
        .maintenance-icon {
            font-size: 4rem;
            color: #ffc107;
            margin-bottom: 20px;
        }
        
        .maintenance-text h3 {
            color: #333;
            margin-bottom: 15px;
            font-size: 1.5rem;
        }
        
        .maintenance-text p {
            color: #666;
            font-size: 1rem;
            line-height: 1.6;
        }
        
        .maintenance-close {
            position: absolute;
            top: 15px;
            right: 20px;
            font-size: 1.5rem;
            color: #999;
            cursor: pointer;
            transition: color 0.3s ease;
        }
        
        .maintenance-close:hover {
            color: #333;
        }
        
        @media (max-width: 768px) {
            .maintenance-content {
                margin: 20px;
                padding: 30px 20px;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(window.maintenanceBanner);
}

function hideMaintenanceBanner() {
    if (window.maintenanceBanner) {
        window.maintenanceBanner.remove();
        window.maintenanceBanner = null;
    }
}

// Clean up interval on page unload
window.addEventListener('beforeunload', function() {
    if (window.maintenanceCheckInterval) {
        clearInterval(window.maintenanceCheckInterval);
    }
});