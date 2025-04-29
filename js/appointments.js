// Appointments Module
class AppointmentManager {
    constructor() {
        this.doctors = {
            general: [
                { id: 'g1', name: 'Dr. Ikram Said' },
                { id: 'g2', name: 'Dr. Ssempijja John' }
            ],
            cardiology: [
                { id: 'c1', name: 'Dr. Mugerwa Hatwib' },
                { id: 'c2', name: 'Dr. Emily Williams' }
            ],
            dental: [
                { id: 'd1', name: 'Dr. Patience Tush' },
                { id: 'd2', name: 'Dr. Joan R' }
            ],
            orthopedics: [
                { id: 'o1', name: 'Dr. Jane N' },
                { id: 'o2', name: 'Dr. Maria A' }
            ],
            pediatrics: [
                { id: 'p1', name: 'Dr. David L' },
                { id: 'p2', name: 'Dr. J Taylor' }
            ]
        };

        this.init();
    }

    init() {
        // Check if user is authenticated
        this.checkAuthentication();
        
        // Set minimum date to today
        this.setMinimumDate();
        
        // Add event listeners
        this.setupEventListeners();
        
        // Pre-fill user data if available
        this.prefillUserData();
    }

    checkAuthentication() {
        const userSession = localStorage.getItem('userSession');
        if (!userSession) {
            // Redirect to home page with login prompt
            window.location.href = '../index.html';
            return;
        }
    }

    setMinimumDate() {
        const dateInput = document.getElementById('appointmentDate');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.min = today;
            
            // Set max date to 3 months from today
            const maxDate = new Date();
            maxDate.setMonth(maxDate.getMonth() + 3);
            dateInput.max = maxDate.toISOString().split('T')[0];
        }
    }

    setupEventListeners() {
        // Department change handler
        const departmentSelect = document.getElementById('department');
        if (departmentSelect) {
            departmentSelect.addEventListener('change', () => this.updateDoctors());
        }

        // Form submission handler
        const appointmentForm = document.getElementById('appointmentForm');
        if (appointmentForm) {
            appointmentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAppointmentSubmission();
            });
        }
    }

    prefillUserData() {
        const userSession = localStorage.getItem('userSession');
        if (userSession) {
            const userData = JSON.parse(userSession);
            const emailInput = document.getElementById('appointmentEmail');
            if (emailInput) {
                emailInput.value = userData.email;
            }
        }
    }

    updateDoctors() {
        const department = document.getElementById('department').value;
        const doctorSelect = document.getElementById('doctor');
        
        // Clear existing options
        doctorSelect.innerHTML = '<option value="">Select doctor...</option>';
        
        // Add doctors for selected department
        if (department && this.doctors[department]) {
            this.doctors[department].forEach(doctor => {
                const option = document.createElement('option');
                option.value = doctor.id;
                option.textContent = doctor.name;
                doctorSelect.appendChild(option);
            });
        }
    }

    handleAppointmentSubmission() {
        // Get form data
        const appointmentData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('appointmentEmail').value,
            phone: document.getElementById('phone').value,
            date: document.getElementById('appointmentDate').value,
            time: document.getElementById('appointmentTime').value,
            department: document.getElementById('department').value,
            doctor: document.getElementById('doctor').value,
            reason: document.getElementById('reason').value,
            status: 'pending',
            id: this.generateAppointmentId(),
            createdAt: new Date().toISOString()
        };

        // Validate appointment data
        if (!this.validateAppointment(appointmentData)) {
            return;
        }

        // Save appointment
        this.saveAppointment(appointmentData);
    }

    validateAppointment(data) {
        // Check if time slot is available
        const existingAppointments = this.getAppointments();
        const conflictingAppointment = existingAppointments.find(appointment => 
            appointment.date === data.date && 
            appointment.time === data.time && 
            appointment.doctor === data.doctor
        );

        if (conflictingAppointment) {
            this.showToast('This time slot is already booked. Please select another time.', 'error');
            return false;
        }

        // Validate phone number
        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        if (!phoneRegex.test(data.phone)) {
            this.showToast('Please enter a valid phone number', 'error');
            return false;
        }

        return true;
    }

    saveAppointment(appointmentData) {
        // Get existing appointments
        const appointments = this.getAppointments();
        
        // Add new appointment
        appointments.push(appointmentData);
        
        // Save to localStorage
        localStorage.setItem('appointments', JSON.stringify(appointments));

        // Show success message
        this.showToast('Appointment booked successfully!', 'success');

        // Reset form
        document.getElementById('appointmentForm').reset();

        // Redirect to confirmation page or show confirmation modal
        this.showConfirmation(appointmentData);
    }

    getAppointments() {
        return JSON.parse(localStorage.getItem('appointments') || '[]');
    }

    generateAppointmentId() {
        return 'apt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    showConfirmation(appointmentData) {
        // Create confirmation modal
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'confirmationModal';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Appointment Confirmed</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <h6>Appointment Details:</h6>
                        <p><strong>Date:</strong> ${appointmentData.date}</p>
                        <p><strong>Time:</strong> ${appointmentData.time}</p>
                        <p><strong>Department:</strong> ${appointmentData.department}</p>
                        <p><strong>Doctor:</strong> ${this.getDoctorName(appointmentData.doctor)}</p>
                        <p><strong>Reference ID:</strong> ${appointmentData.id}</p>
                        <div class="alert alert-info">
                            A confirmation email has been sent to ${appointmentData.email}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        `;

        // Add modal to body
        document.body.appendChild(modal);

        // Show modal
        const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
        confirmationModal.show();

        // Remove modal from DOM after it's hidden
        modal.addEventListener('hidden.bs.modal', function () {
            modal.remove();
        });
    }

    getDoctorName(doctorId) {
        for (let department in this.doctors) {
            const doctor = this.doctors[department].find(d => d.id === doctorId);
            if (doctor) {
                return doctor.name;
            }
        }
        return 'Unknown Doctor';
    }

    showToast(message, type = 'success') {
        // Create toast container if it doesn't exist
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }

        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast ${type} show`;
        toast.innerHTML = `
            <div class="toast-header">
                <strong class="me-auto">${type === 'success' ? 'Success' : 'Error'}</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        `;

        // Add toast to container
        toastContainer.appendChild(toast);

        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Initialize appointment manager
document.addEventListener('DOMContentLoaded', () => {
    window.appointmentManager = new AppointmentManager();
});
