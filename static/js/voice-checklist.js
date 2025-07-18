/**
 * Voice-Guided Mission Preparation Checklist
 * Provides voice guidance for drone mission preparation
 */

class VoiceChecklist {
    constructor() {
        this.isActive = false;
        this.currentStep = 0;
        this.checklist = [
            {
                id: 'weather_check',
                title: 'Weather Assessment',
                description: 'Check current weather conditions for flight safety',
                voice: 'First, let us check the weather conditions. Ensure wind speed is below 25 kilometers per hour and visibility is good.',
                action: 'checkWeather'
            },
            {
                id: 'drone_battery',
                title: 'Drone Battery Check',
                description: 'Verify drone battery is fully charged (minimum 80%)',
                voice: 'Next, verify that your drone battery is charged to at least 80 percent. Check the battery indicator on your drone.',
                action: 'checkBattery'
            },
            {
                id: 'medical_payload',
                title: 'Medical Payload Verification',
                description: 'Confirm medical supplies are properly secured',
                voice: 'Now, verify that all medical supplies are properly secured in the payload compartment. Check that items are not loose.',
                action: 'checkPayload'
            },
            {
                id: 'communication',
                title: 'Communication Test',
                description: 'Test communication systems and GPS signal',
                voice: 'Test the communication systems. Ensure GPS signal is strong and telemetry is functioning properly.',
                action: 'testCommunication'
            },
            {
                id: 'flight_path',
                title: 'Flight Path Review',
                description: 'Review planned flight path and no-fly zones',
                voice: 'Review your planned flight path. Ensure the route avoids no-fly zones and obstacles.',
                action: 'reviewFlightPath'
            },
            {
                id: 'emergency_procedures',
                title: 'Emergency Procedures',
                description: 'Confirm emergency landing procedures and backup plans',
                voice: 'Finally, review emergency procedures. Confirm you know the emergency landing locations and backup plans.',
                action: 'reviewEmergency'
            }
        ];
        
        this.completedSteps = new Set();
        this.speechSynthesis = window.speechSynthesis;
        this.voices = [];
        this.selectedVoice = null;
        
        this.init();
    }
    
    init() {
        this.loadVoices();
        this.createChecklistModal();
        this.setupEventListeners();
        
        // Load voices when they become available
        if (this.speechSynthesis.onvoiceschanged !== undefined) {
            this.speechSynthesis.onvoiceschanged = () => this.loadVoices();
        }
    }
    
    loadVoices() {
        this.voices = this.speechSynthesis.getVoices();
        // Prefer English voices
        this.selectedVoice = this.voices.find(voice => 
            voice.lang.includes('en') && voice.name.includes('Female')
        ) || this.voices.find(voice => voice.lang.includes('en')) || this.voices[0];
    }
    
    createChecklistModal() {
        const modalHTML = `
            <div class="modal fade" id="voiceChecklistModal" tabindex="-1" aria-labelledby="voiceChecklistModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title" id="voiceChecklistModalLabel">
                                <i class="fas fa-microphone-alt me-2"></i>
                                Voice-Guided Mission Preparation
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="voice-controls mb-4">
                                <button id="startVoiceGuide" class="btn btn-success me-2">
                                    <i class="fas fa-play me-2"></i>Start Voice Guide
                                </button>
                                <button id="pauseVoiceGuide" class="btn btn-warning me-2" disabled>
                                    <i class="fas fa-pause me-2"></i>Pause
                                </button>
                                <button id="stopVoiceGuide" class="btn btn-danger me-2" disabled>
                                    <i class="fas fa-stop me-2"></i>Stop
                                </button>
                                <button id="nextStep" class="btn btn-info me-2" disabled>
                                    <i class="fas fa-forward me-2"></i>Next Step
                                </button>
                            </div>
                            
                            <div class="progress mb-4">
                                <div class="progress-bar" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                            
                            <div class="current-step-info mb-4">
                                <div class="alert alert-info">
                                    <h6><i class="fas fa-info-circle me-2"></i>Ready to Begin</h6>
                                    <p class="mb-0">Click "Start Voice Guide" to begin the mission preparation checklist.</p>
                                </div>
                            </div>
                            
                            <div class="checklist-items">
                                ${this.checklist.map((item, index) => `
                                    <div class="checklist-item" data-step="${index}">
                                        <div class="card mb-3">
                                            <div class="card-body">
                                                <div class="d-flex align-items-center">
                                                    <div class="step-indicator me-3">
                                                        <span class="badge bg-secondary">${index + 1}</span>
                                                    </div>
                                                    <div class="flex-grow-1">
                                                        <h6 class="card-title mb-1">${item.title}</h6>
                                                        <p class="card-text small text-muted mb-0">${item.description}</p>
                                                    </div>
                                                    <div class="step-status">
                                                        <i class="fas fa-circle text-muted"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" id="completeChecklist" disabled>
                                <i class="fas fa-check me-2"></i>Complete Checklist
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    setupEventListeners() {
        const startBtn = document.getElementById('startVoiceGuide');
        const pauseBtn = document.getElementById('pauseVoiceGuide');
        const stopBtn = document.getElementById('stopVoiceGuide');
        const nextBtn = document.getElementById('nextStep');
        const completeBtn = document.getElementById('completeChecklist');
        
        startBtn.addEventListener('click', () => this.startVoiceGuide());
        pauseBtn.addEventListener('click', () => this.pauseVoiceGuide());
        stopBtn.addEventListener('click', () => this.stopVoiceGuide());
        nextBtn.addEventListener('click', () => this.nextStep());
        completeBtn.addEventListener('click', () => this.completeChecklist());
        
        // Add click listeners to checklist items for manual completion
        document.querySelectorAll('.checklist-item').forEach((item, index) => {
            item.addEventListener('click', () => this.toggleStepCompletion(index));
        });
    }
    
    async startVoiceGuide() {
        this.isActive = true;
        this.currentStep = 0;
        this.updateButtonStates();
        
        // Start session with backend
        try {
            const response = await fetch('/api/voice-checklist/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            
            if (data.success) {
                this.sessionId = data.session_id;
            }
        } catch (error) {
            console.error('Failed to start voice checklist session:', error);
        }
        
        // Speak welcome message
        this.speak('Welcome to the SierraWings mission preparation checklist. I will guide you through each step to ensure your drone mission is safe and successful.');
        
        setTimeout(() => {
            this.processCurrentStep();
        }, 3000);
    }
    
    pauseVoiceGuide() {
        this.speechSynthesis.cancel();
        this.isActive = false;
        this.updateButtonStates();
    }
    
    stopVoiceGuide() {
        this.speechSynthesis.cancel();
        this.isActive = false;
        this.currentStep = 0;
        this.completedSteps.clear();
        this.updateButtonStates();
        this.updateProgress();
        this.updateCurrentStepInfo('Ready to Begin', 'Click "Start Voice Guide" to begin the mission preparation checklist.');
        this.resetStepVisuals();
    }
    
    nextStep() {
        if (this.currentStep < this.checklist.length - 1) {
            this.currentStep++;
            this.processCurrentStep();
        } else {
            this.completeChecklist();
        }
    }
    
    processCurrentStep() {
        if (!this.isActive) return;
        
        const step = this.checklist[this.currentStep];
        this.updateCurrentStepInfo(step.title, step.description);
        this.highlightCurrentStep();
        
        // Speak the step instructions
        this.speak(step.voice);
        
        // Execute step-specific action
        this.executeStepAction(step.action);
        
        this.updateProgress();
    }
    
    async executeStepAction(action) {
        switch (action) {
            case 'checkWeather':
                await this.checkWeatherConditions();
                break;
            case 'checkBattery':
                await this.checkDroneBattery();
                break;
            case 'checkPayload':
                await this.checkMedicalPayload();
                break;
            case 'testCommunication':
                await this.testCommunicationSystems();
                break;
            case 'reviewFlightPath':
                await this.reviewFlightPath();
                break;
            case 'reviewEmergency':
                await this.reviewEmergencyProcedures();
                break;
        }
    }
    
    async checkWeatherConditions() {
        try {
            const response = await fetch('/api/voice-checklist/weather');
            const data = await response.json();
            
            if (data.success) {
                const weather = data.weather;
                if (weather.flight_safe) {
                    this.speak(`Weather conditions are acceptable for flight. Temperature is ${weather.temperature} degrees, wind speed is ${weather.wind_speed} kilometers per hour. You may proceed to the next step.`);
                } else {
                    this.speak(`Weather conditions are not suitable for flight. ${weather.warnings.join('. ')}. Please wait for better conditions.`);
                }
                this.markStepCompleted(this.currentStep);
            } else {
                this.speak('Unable to retrieve weather data. Please check manually before proceeding.');
                this.markStepCompleted(this.currentStep);
            }
        } catch (error) {
            console.error('Weather check failed:', error);
            this.speak('Weather check failed. Please verify conditions manually before proceeding.');
            this.markStepCompleted(this.currentStep);
        }
    }
    
    async checkDroneBattery() {
        try {
            const response = await fetch('/api/voice-checklist/drone-status');
            const data = await response.json();
            
            if (data.success && data.drones.length > 0) {
                const drone = data.drones[0]; // Use first available drone
                if (drone.battery_level >= 80) {
                    this.speak(`Drone battery level is ${drone.battery_level} percent. Battery is sufficient for flight. Ensure all connections are secure before proceeding.`);
                } else {
                    this.speak(`Drone battery level is ${drone.battery_level} percent. Please charge the battery to at least 80 percent before flight.`);
                }
            } else {
                this.speak('No drones available or unable to check battery status. Please verify manually.');
            }
            this.markStepCompleted(this.currentStep);
        } catch (error) {
            console.error('Battery check failed:', error);
            this.speak('Battery check failed. Please verify drone battery level manually.');
            this.markStepCompleted(this.currentStep);
        }
    }
    
    async checkMedicalPayload() {
        // For medical payload, we'll use a simple confirmation
        setTimeout(() => {
            this.speak('Please verify that all medical supplies are properly secured in the payload compartment. Check that items are not loose and the compartment is sealed.');
            this.markStepCompleted(this.currentStep);
        }, 2000);
    }
    
    async testCommunicationSystems() {
        try {
            const response = await fetch('/api/voice-checklist/communication-test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            
            if (data.success) {
                const comm = data.communication;
                if (comm.all_systems_ok) {
                    this.speak(`Communication systems are functioning normally. GPS signal is ${comm.gps_signal}, telemetry link is ${comm.telemetry_link}, and radio connection is ${comm.radio_connection}.`);
                } else {
                    this.speak('Communication systems have issues. Please check connections and try again.');
                }
            } else {
                this.speak('Unable to test communication systems. Please verify manually.');
            }
            this.markStepCompleted(this.currentStep);
        } catch (error) {
            console.error('Communication test failed:', error);
            this.speak('Communication test failed. Please verify systems manually.');
            this.markStepCompleted(this.currentStep);
        }
    }
    
    async reviewFlightPath() {
        try {
            const response = await fetch('/api/voice-checklist/flight-path');
            const data = await response.json();
            
            if (data.success) {
                const path = data.flight_path;
                if (path.route_clear) {
                    this.speak(`Flight path has been reviewed. No obstacles or no-fly zones detected. Estimated flight time is ${path.estimated_flight_time} minutes.`);
                } else {
                    this.speak('Flight path has obstacles or restrictions. Please review and adjust route before proceeding.');
                }
            } else {
                this.speak('Unable to review flight path. Please check manually.');
            }
            this.markStepCompleted(this.currentStep);
        } catch (error) {
            console.error('Flight path review failed:', error);
            this.speak('Flight path review failed. Please verify route manually.');
            this.markStepCompleted(this.currentStep);
        }
    }
    
    async reviewEmergencyProcedures() {
        try {
            const response = await fetch('/api/voice-checklist/emergency-procedures');
            const data = await response.json();
            
            if (data.success) {
                const emergency = data.emergency_info;
                this.speak(`Emergency procedures confirmed. ${emergency.emergency_landing_sites.length} emergency landing sites identified. Backup communication is ${emergency.backup_communication}. You are ready for mission deployment.`);
            } else {
                this.speak('Unable to retrieve emergency procedures. Please review manually.');
            }
            this.markStepCompleted(this.currentStep);
        } catch (error) {
            console.error('Emergency procedures review failed:', error);
            this.speak('Emergency procedures review failed. Please verify manually.');
            this.markStepCompleted(this.currentStep);
        }
    }
    
    markStepCompleted(stepIndex) {
        this.completedSteps.add(stepIndex);
        const stepElement = document.querySelector(`.checklist-item[data-step="${stepIndex}"]`);
        const statusIcon = stepElement.querySelector('.step-status i');
        const stepIndicator = stepElement.querySelector('.step-indicator .badge');
        
        statusIcon.className = 'fas fa-check-circle text-success';
        stepIndicator.className = 'badge bg-success';
        
        this.updateProgress();
        this.checkAllStepsCompleted();
    }
    
    toggleStepCompletion(stepIndex) {
        if (this.completedSteps.has(stepIndex)) {
            this.completedSteps.delete(stepIndex);
            const stepElement = document.querySelector(`.checklist-item[data-step="${stepIndex}"]`);
            const statusIcon = stepElement.querySelector('.step-status i');
            const stepIndicator = stepElement.querySelector('.step-indicator .badge');
            
            statusIcon.className = 'fas fa-circle text-muted';
            stepIndicator.className = 'badge bg-secondary';
        } else {
            this.markStepCompleted(stepIndex);
        }
    }
    
    highlightCurrentStep() {
        // Remove previous highlights
        document.querySelectorAll('.checklist-item').forEach(item => {
            item.classList.remove('current-step');
        });
        
        // Highlight current step
        const currentStepElement = document.querySelector(`.checklist-item[data-step="${this.currentStep}"]`);
        if (currentStepElement) {
            currentStepElement.classList.add('current-step');
        }
    }
    
    updateCurrentStepInfo(title, description) {
        const infoDiv = document.querySelector('.current-step-info');
        infoDiv.innerHTML = `
            <div class="alert alert-info">
                <h6><i class="fas fa-info-circle me-2"></i>${title}</h6>
                <p class="mb-0">${description}</p>
            </div>
        `;
    }
    
    updateProgress() {
        const progressBar = document.querySelector('.progress-bar');
        const progress = (this.completedSteps.size / this.checklist.length) * 100;
        progressBar.style.width = `${progress}%`;
        progressBar.setAttribute('aria-valuenow', progress);
    }
    
    updateButtonStates() {
        const startBtn = document.getElementById('startVoiceGuide');
        const pauseBtn = document.getElementById('pauseVoiceGuide');
        const stopBtn = document.getElementById('stopVoiceGuide');
        const nextBtn = document.getElementById('nextStep');
        
        startBtn.disabled = this.isActive;
        pauseBtn.disabled = !this.isActive;
        stopBtn.disabled = !this.isActive;
        nextBtn.disabled = !this.isActive;
    }
    
    checkAllStepsCompleted() {
        const completeBtn = document.getElementById('completeChecklist');
        completeBtn.disabled = this.completedSteps.size < this.checklist.length;
    }
    
    resetStepVisuals() {
        document.querySelectorAll('.checklist-item').forEach((item, index) => {
            item.classList.remove('current-step');
            const statusIcon = item.querySelector('.step-status i');
            const stepIndicator = item.querySelector('.step-indicator .badge');
            
            statusIcon.className = 'fas fa-circle text-muted';
            stepIndicator.className = 'badge bg-secondary';
        });
    }
    
    async completeChecklist() {
        // Complete session with backend
        try {
            const response = await fetch('/api/voice-checklist/complete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    session_id: this.sessionId,
                    completed_steps: this.checklist.map(step => step.completed)
                })
            });
            const data = await response.json();
            
            if (data.success) {
                console.log('Checklist session completed successfully');
            }
        } catch (error) {
            console.error('Failed to complete voice checklist session:', error);
        }
        
        this.speak('Mission preparation checklist completed successfully. Your drone is ready for deployment. Stay safe and fly responsibly.');
        
        // Close modal after a delay
        setTimeout(() => {
            const modal = bootstrap.Modal.getInstance(document.getElementById('voiceChecklistModal'));
            if (modal) {
                modal.hide();
            }
        }, 4000);
        
        this.stopVoiceGuide();
    }
    
    speak(text) {
        if (this.speechSynthesis && this.selectedVoice) {
            this.speechSynthesis.cancel(); // Cancel any ongoing speech
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = this.selectedVoice;
            utterance.rate = 0.9;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;
            
            this.speechSynthesis.speak(utterance);
        }
    }
    
    openChecklist() {
        const modal = new bootstrap.Modal(document.getElementById('voiceChecklistModal'));
        modal.show();
    }
}

// Add CSS for voice checklist styling
const voiceChecklistCSS = `
    .checklist-item.current-step {
        border-left: 4px solid #0d6efd;
        background-color: #f8f9fa;
    }
    
    .checklist-item .card {
        transition: all 0.3s ease;
        cursor: pointer;
    }
    
    .checklist-item .card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    .step-indicator {
        min-width: 40px;
        text-align: center;
    }
    
    .voice-controls {
        border-bottom: 1px solid #dee2e6;
        padding-bottom: 1rem;
    }
    
    .current-step-info {
        position: sticky;
        top: 0;
        z-index: 1;
        background: white;
        border-radius: 8px;
    }
    
    .progress {
        height: 8px;
        background-color: #e9ecef;
    }
    
    .progress-bar {
        transition: width 0.6s ease;
    }
    
    @media (max-width: 768px) {
        .voice-controls {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.5rem;
        }
        
        .voice-controls button {
            margin: 0 !important;
        }
    }
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = voiceChecklistCSS;
document.head.appendChild(style);

// Initialize voice checklist when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.voiceChecklist = new VoiceChecklist();
});