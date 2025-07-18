/**
 * Personalized Dashboard Widgets
 * Creates customizable widgets for different user roles
 */

class DashboardWidgets {
    constructor() {
        this.userRole = document.body.dataset.userRole || 'patient';
        this.widgets = new Map();
        this.init();
    }

    init() {
        this.createWidgetStyles();
        this.createWidgets();
        this.setupWidgetInteractions();
        this.loadWidgetPreferences();
    }

    createWidgetStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .dashboard-widgets-container {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin: 20px 0;
            }

            .dashboard-widget {
                background: white;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                border: 1px solid #e9ecef;
                transition: all 0.3s ease;
                position: relative;
            }

            .dashboard-widget:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 16px rgba(0,0,0,0.15);
            }

            .widget-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 1px solid #e9ecef;
            }

            .widget-title {
                font-size: 16px;
                font-weight: 600;
                color: #2c3e50;
                margin: 0;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .widget-icon {
                font-size: 18px;
            }

            .widget-actions {
                display: flex;
                gap: 5px;
            }

            .widget-action-btn {
                background: none;
                border: none;
                cursor: pointer;
                padding: 5px;
                border-radius: 4px;
                color: #6c757d;
                font-size: 14px;
                transition: all 0.2s ease;
            }

            .widget-action-btn:hover {
                background: #f8f9fa;
                color: #2c3e50;
            }

            .widget-content {
                min-height: 120px;
            }

            .widget-stat {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px solid #f8f9fa;
            }

            .widget-stat:last-child {
                border-bottom: none;
            }

            .stat-label {
                color: #6c757d;
                font-size: 14px;
            }

            .stat-value {
                font-weight: 600;
                color: #2c3e50;
                font-size: 16px;
            }

            .stat-trend {
                font-size: 12px;
                margin-left: 5px;
            }

            .trend-up { color: #27ae60; }
            .trend-down { color: #e74c3c; }
            .trend-neutral { color: #f39c12; }

            .widget-chart {
                height: 120px;
                position: relative;
                margin: 10px 0;
            }

            .quick-actions-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
                margin-top: 15px;
            }

            .widget-list {
                max-height: 200px;
                overflow-y: auto;
            }

            .widget-list-item {
                display: flex;
                align-items: center;
                padding: 10px 0;
                border-bottom: 1px solid #f8f9fa;
            }

            .widget-list-item:last-child {
                border-bottom: none;
            }

            .list-item-icon {
                margin-right: 10px;
                font-size: 16px;
            }

            .list-item-content {
                flex: 1;
            }

            .list-item-title {
                font-weight: 500;
                color: #2c3e50;
                margin-bottom: 2px;
            }

            .list-item-subtitle {
                font-size: 12px;
                color: #6c757d;
            }

            .list-item-action {
                color: #3498db;
                font-size: 12px;
                cursor: pointer;
                text-decoration: none;
            }

            .list-item-action:hover {
                text-decoration: underline;
            }

            .widget-progress {
                margin: 10px 0;
            }

            .progress-label {
                display: flex;
                justify-content: space-between;
                font-size: 12px;
                color: #6c757d;
                margin-bottom: 5px;
            }

            .progress-bar-widget {
                height: 6px;
                background: #e9ecef;
                border-radius: 3px;
                overflow: hidden;
            }

            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #3498db, #2ecc71);
                border-radius: 3px;
                transition: width 0.3s ease;
            }

            .widget-metric {
                text-align: center;
                padding: 15px;
                background: #f8f9fa;
                border-radius: 8px;
                margin: 10px 0;
            }

            .metric-value {
                font-size: 24px;
                font-weight: 700;
                color: #2c3e50;
                margin-bottom: 5px;
            }

            .metric-label {
                font-size: 12px;
                color: #6c757d;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .weather-widget {
                background: linear-gradient(135deg, #3498db, #2ecc71);
                color: white;
            }

            .weather-widget .widget-title {
                color: white;
            }

            .weather-info {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 15px 0;
            }

            .weather-temp {
                font-size: 32px;
                font-weight: 700;
            }

            .weather-desc {
                font-size: 14px;
                opacity: 0.9;
            }

            .weather-details {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
                margin-top: 15px;
            }

            .weather-detail {
                text-align: center;
                padding: 8px;
                background: rgba(255,255,255,0.1);
                border-radius: 6px;
            }

            .widget-minimized {
                height: 60px;
                overflow: hidden;
            }

            .widget-minimized .widget-content {
                display: none;
            }

            .resize-handle {
                position: absolute;
                bottom: 0;
                right: 0;
                width: 20px;
                height: 20px;
                cursor: nw-resize;
                background: linear-gradient(-45deg, transparent 0%, transparent 40%, #ccc 40%, #ccc 60%, transparent 60%);
            }

            @media (max-width: 768px) {
                .dashboard-widgets-container {
                    grid-template-columns: 1fr;
                }
            }
        `;
        document.head.appendChild(style);
    }

    createWidgets() {
        const container = this.getWidgetContainer();
        if (!container) return;

        const widgets = this.getWidgetsForRole(this.userRole);
        
        widgets.forEach(widget => {
            const widgetElement = this.createWidgetElement(widget);
            container.appendChild(widgetElement);
            this.widgets.set(widget.id, widgetElement);
        });
    }

    getWidgetContainer() {
        let container = document.querySelector('.dashboard-widgets-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'dashboard-widgets-container';
            
            const mainContent = document.querySelector('.container-fluid') || document.querySelector('.container') || document.querySelector('main');
            if (mainContent) {
                mainContent.insertBefore(container, mainContent.firstChild);
            }
        }
        return container;
    }

    getWidgetsForRole(role) {
        const widgets = {
            patient: [
                {
                    id: 'delivery-stats',
                    title: 'My Deliveries',
                    icon: '📦',
                    type: 'stats',
                    data: this.getDeliveryStats
                },
                {
                    id: 'quick-actions',
                    title: 'Quick Actions',
                    icon: '⚡',
                    type: 'actions',
                    data: this.getPatientActions
                },
                {
                    id: 'recent-activity',
                    title: 'Recent Activity',
                    icon: '📋',
                    type: 'list',
                    data: this.getRecentActivity
                },
                {
                    id: 'weather',
                    title: 'Weather',
                    icon: '🌤️',
                    type: 'weather',
                    data: this.getWeatherData
                }
            ],
            clinic: [
                {
                    id: 'mission-overview',
                    title: 'Mission Overview',
                    icon: '🎯',
                    type: 'stats',
                    data: this.getMissionStats
                },
                {
                    id: 'patient-summary',
                    title: 'Patient Summary',
                    icon: '👥',
                    type: 'stats',
                    data: this.getPatientStats
                },
                {
                    id: 'clinic-actions',
                    title: 'Quick Actions',
                    icon: '⚡',
                    type: 'actions',
                    data: this.getClinicActions
                },
                {
                    id: 'pending-requests',
                    title: 'Pending Requests',
                    icon: '⏳',
                    type: 'list',
                    data: this.getPendingRequests
                }
            ],
            admin: [
                {
                    id: 'system-overview',
                    title: 'System Overview',
                    icon: '🖥️',
                    type: 'stats',
                    data: this.getSystemStats
                },
                {
                    id: 'drone-fleet',
                    title: 'Drone Fleet',
                    icon: '🚁',
                    type: 'stats',
                    data: this.getDroneStats
                },
                {
                    id: 'admin-actions',
                    title: 'Admin Actions',
                    icon: '⚙️',
                    type: 'actions',
                    data: this.getAdminActions
                },
                {
                    id: 'recent-alerts',
                    title: 'Recent Alerts',
                    icon: '🚨',
                    type: 'list',
                    data: this.getRecentAlerts
                }
            ]
        };

        return widgets[role] || widgets.patient;
    }

    createWidgetElement(widget) {
        const element = document.createElement('div');
        element.className = 'dashboard-widget';
        element.dataset.widgetId = widget.id;
        
        element.innerHTML = `
            <div class="widget-header">
                <h3 class="widget-title">
                    <span class="widget-icon">${widget.icon}</span>
                    ${widget.title}
                </h3>
                <div class="widget-actions">
                    <button class="widget-action-btn" data-action="refresh" title="Refresh">
                        🔄
                    </button>
                    <button class="widget-action-btn" data-action="minimize" title="Minimize">
                        ➖
                    </button>
                </div>
            </div>
            <div class="widget-content">
                <div class="widget-loading">Loading...</div>
            </div>
            <div class="resize-handle"></div>
        `;

        // Load widget content
        this.loadWidgetContent(element, widget);
        
        return element;
    }

    loadWidgetContent(element, widget) {
        const content = element.querySelector('.widget-content');
        const data = widget.data.call(this);
        
        switch (widget.type) {
            case 'stats':
                content.innerHTML = this.createStatsContent(data);
                break;
            case 'actions':
                content.innerHTML = this.createActionsContent(data);
                break;
            case 'list':
                content.innerHTML = this.createListContent(data);
                break;
            case 'weather':
                content.innerHTML = this.createWeatherContent(data);
                break;
            case 'chart':
                content.innerHTML = this.createChartContent(data);
                break;
            default:
                content.innerHTML = '<p>Widget type not supported</p>';
        }
    }

    createStatsContent(data) {
        return data.map(stat => `
            <div class="widget-stat">
                <span class="stat-label">${stat.label}</span>
                <span class="stat-value">
                    ${stat.value}
                    ${stat.trend ? `<span class="stat-trend trend-${stat.trend.type}">${stat.trend.icon}</span>` : ''}
                </span>
            </div>
        `).join('');
    }

    createActionsContent(data) {
        return `
            <div class="quick-actions-grid">
                ${data.map(action => `
                    <button class="btn-professional-card" onclick="window.location.href='${action.url}'">
                        <span class="btn-professional-card-icon">${action.icon}</span>
                        <div class="btn-professional-card-title">${action.label}</div>
                    </button>
                `).join('')}
            </div>
        `;
    }

    createListContent(data) {
        return `
            <div class="widget-list">
                ${data.map(item => `
                    <div class="widget-list-item">
                        <span class="list-item-icon">${item.icon}</span>
                        <div class="list-item-content">
                            <div class="list-item-title">${item.title}</div>
                            <div class="list-item-subtitle">${item.subtitle}</div>
                        </div>
                        ${item.action ? `<a href="${item.action.url}" class="list-item-action">${item.action.label}</a>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }

    createWeatherContent(data) {
        return `
            <div class="weather-info">
                <div>
                    <div class="weather-temp">${data.temperature}°C</div>
                    <div class="weather-desc">${data.description}</div>
                </div>
                <div class="weather-icon" style="font-size: 48px;">${data.icon}</div>
            </div>
            <div class="weather-details">
                <div class="weather-detail">
                    <div>💨 ${data.windSpeed} km/h</div>
                </div>
                <div class="weather-detail">
                    <div>💧 ${data.humidity}%</div>
                </div>
            </div>
        `;
    }

    // Data providers for different widget types
    getDeliveryStats() {
        return [
            { label: 'Total Deliveries', value: '12', trend: { type: 'up', icon: '↗️' } },
            { label: 'This Month', value: '3', trend: { type: 'up', icon: '↗️' } },
            { label: 'Success Rate', value: '95%', trend: { type: 'neutral', icon: '→' } },
            { label: 'Average Time', value: '23 min', trend: { type: 'down', icon: '↘️' } }
        ];
    }

    getPatientActions() {
        return [
            { icon: '📞', label: 'Emergency', url: '/emergency' },
            { icon: '📋', label: 'Request Delivery', url: '/request-delivery' }
        ];
    }

    getRecentActivity() {
        return [
            { icon: '✅', title: 'Delivery completed', subtitle: '2 hours ago', action: { url: '/view-delivery/1', label: 'View' } },
            { icon: '🚁', title: 'Drone assigned', subtitle: '1 day ago', action: { url: '/track-mission/2', label: 'Track' } },
            { icon: '📋', title: 'Order placed', subtitle: '2 days ago', action: { url: '/view-order/3', label: 'View' } }
        ];
    }

    getWeatherData() {
        return {
            temperature: 28,
            description: 'Partly Cloudy',
            icon: '⛅',
            windSpeed: 12,
            humidity: 65
        };
    }

    getMissionStats() {
        return [
            { label: 'Active Missions', value: '8', trend: { type: 'up', icon: '↗️' } },
            { label: 'Completed Today', value: '15', trend: { type: 'up', icon: '↗️' } },
            { label: 'Pending Approval', value: '3', trend: { type: 'neutral', icon: '→' } },
            { label: 'Success Rate', value: '98%', trend: { type: 'up', icon: '↗️' } }
        ];
    }

    getPatientStats() {
        return [
            { label: 'Total Patients', value: '247', trend: { type: 'up', icon: '↗️' } },
            { label: 'Active Cases', value: '32', trend: { type: 'up', icon: '↗️' } },
            { label: 'New This Week', value: '18', trend: { type: 'up', icon: '↗️' } },
            { label: 'Critical Cases', value: '2', trend: { type: 'down', icon: '↘️' } }
        ];
    }

    getClinicActions() {
        return [
            { icon: '👥', label: 'Patient Records', url: '/patient-records' },
            { icon: '🎯', label: 'Manage Missions', url: '/manage-missions' },
            { icon: '📊', label: 'Analytics', url: '/analytics' },
            { icon: '⚙️', label: 'Settings', url: '/settings' }
        ];
    }

    getPendingRequests() {
        return [
            { icon: '🚨', title: 'Emergency medication', subtitle: 'Patient: John Doe', action: { url: '/accept-mission/1', label: 'Accept' } },
            { icon: '💊', title: 'Insulin delivery', subtitle: 'Patient: Jane Smith', action: { url: '/accept-mission/2', label: 'Accept' } },
            { icon: '🩹', title: 'First aid supplies', subtitle: 'Patient: Bob Johnson', action: { url: '/accept-mission/3', label: 'Accept' } }
        ];
    }

    getSystemStats() {
        return [
            { label: 'Active Users', value: '1,247', trend: { type: 'up', icon: '↗️' } },
            { label: 'Total Missions', value: '8,592', trend: { type: 'up', icon: '↗️' } },
            { label: 'System Uptime', value: '99.8%', trend: { type: 'up', icon: '↗️' } },
            { label: 'Response Time', value: '1.2s', trend: { type: 'down', icon: '↘️' } }
        ];
    }

    getDroneStats() {
        return [
            { label: 'Total Drones', value: '24', trend: { type: 'neutral', icon: '→' } },
            { label: 'Active Drones', value: '18', trend: { type: 'up', icon: '↗️' } },
            { label: 'In Maintenance', value: '3', trend: { type: 'down', icon: '↘️' } },
            { label: 'Battery Average', value: '87%', trend: { type: 'up', icon: '↗️' } }
        ];
    }

    getAdminActions() {
        return [
            { icon: '👥', label: 'User Management', url: '/user-management' },
            { icon: '🚁', label: 'Drone Fleet', url: '/drone-management' },
            { icon: '🔧', label: 'Maintenance', url: '/admin/maintenance-alerts' },
            { icon: '📊', label: 'Analytics', url: '/analytics' }
        ];
    }

    getRecentAlerts() {
        return [
            { icon: '🔧', title: 'Maintenance scheduled', subtitle: '3 hours ago', action: { url: '/maintenance/1', label: 'View' } },
            { icon: '⚠️', title: 'Drone battery low', subtitle: '1 hour ago', action: { url: '/drone/5', label: 'Check' } },
            { icon: '📊', title: 'Monthly report ready', subtitle: '2 hours ago', action: { url: '/reports/monthly', label: 'View' } }
        ];
    }

    setupWidgetInteractions() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('widget-action-btn')) {
                const action = e.target.dataset.action;
                const widget = e.target.closest('.dashboard-widget');
                
                switch (action) {
                    case 'refresh':
                        this.refreshWidget(widget);
                        break;
                    case 'minimize':
                        this.toggleWidgetMinimize(widget);
                        break;
                }
            }
        });
    }

    refreshWidget(widget) {
        const widgetId = widget.dataset.widgetId;
        const widgetConfig = this.getWidgetsForRole(this.userRole).find(w => w.id === widgetId);
        
        if (widgetConfig) {
            const refreshBtn = widget.querySelector('[data-action="refresh"]');
            refreshBtn.style.transform = 'rotate(360deg)';
            refreshBtn.style.transition = 'transform 0.5s ease';
            
            setTimeout(() => {
                this.loadWidgetContent(widget, widgetConfig);
                refreshBtn.style.transform = 'rotate(0deg)';
            }, 500);
        }
    }

    toggleWidgetMinimize(widget) {
        const minimizeBtn = widget.querySelector('[data-action="minimize"]');
        
        if (widget.classList.contains('widget-minimized')) {
            widget.classList.remove('widget-minimized');
            minimizeBtn.textContent = '➖';
            minimizeBtn.title = 'Minimize';
        } else {
            widget.classList.add('widget-minimized');
            minimizeBtn.textContent = '➕';
            minimizeBtn.title = 'Expand';
        }
    }

    loadWidgetPreferences() {
        const preferences = localStorage.getItem('sierrawings_widget_preferences');
        if (preferences) {
            const parsed = JSON.parse(preferences);
            
            Object.keys(parsed).forEach(widgetId => {
                const widget = this.widgets.get(widgetId);
                const prefs = parsed[widgetId];
                
                if (widget && prefs.minimized) {
                    this.toggleWidgetMinimize(widget);
                }
            });
        }
    }

    saveWidgetPreferences() {
        const preferences = {};
        
        this.widgets.forEach((widget, widgetId) => {
            preferences[widgetId] = {
                minimized: widget.classList.contains('widget-minimized')
            };
        });
        
        localStorage.setItem('sierrawings_widget_preferences', JSON.stringify(preferences));
    }
}

// Initialize dashboard widgets
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize on dashboard pages
    if (window.location.pathname.includes('dashboard') || 
        document.querySelector('.dashboard-content') ||
        document.querySelector('.main-dashboard')) {
        
        window.dashboardWidgets = new DashboardWidgets();
        
        // Save preferences when page unloads
        window.addEventListener('beforeunload', () => {
            if (window.dashboardWidgets) {
                window.dashboardWidgets.saveWidgetPreferences();
            }
        });
    }
});