document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('hackathon-form');
    const startDateInput = document.getElementById('hackathon-start');
    const endDateInput = document.getElementById('hackathon-end');
    const categorySelect = document.getElementById('hackathon-category');
    const venueSelect = document.getElementById('hackathon-venue');

    // Set minimum date to today for start date
    const today = new Date();
    const todayString = today.toISOString().slice(0, 16);
    startDateInput.min = todayString;

    // Update end date minimum when start date changes
    startDateInput.addEventListener('change', function() {
        if (this.value) {
            endDateInput.min = this.value;
            // If end date is before start date, clear it
            if (endDateInput.value && endDateInput.value < this.value) {
                endDateInput.value = '';
            }
        }
    });

    // Form validation and submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    });

    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });

    function validateForm() {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        // Additional validation for dates
        if (startDateInput.value && endDateInput.value) {
            if (new Date(endDateInput.value) <= new Date(startDateInput.value)) {
                showFieldError(endDateInput, 'End date must be after start date');
                isValid = false;
            }
        }

        return isValid;
    }

    function validateField(field) {
        const value = field.value.trim();

        clearFieldError(field);

        if (field.hasAttribute('required') && !value) {
            showFieldError(field, 'This field is required');
            return false;
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(field, 'Please enter a valid email address');
                return false;
            }
        }
        
        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                showFieldError(field, 'Please enter a valid phone number');
                return false;
            }
        }
        
        return true;
    }

    function showFieldError(field, message) {
        // Remove existing error
        clearFieldError(field);
        
        // Add error class
        field.classList.add('error');
        
        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#dc3545';
        errorDiv.style.fontSize = '0.85rem';
        errorDiv.style.marginTop = '5px';
        
        // Insert error message after the field
        field.parentNode.appendChild(errorDiv);
    }

    function clearFieldError(field) {
        field.classList.remove('error');
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    function submitForm() {
        // Show loading state
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual submission logic)
        setTimeout(() => {
            // Show success message
            showSuccessMessage();
            
            // Reset form
            form.reset();
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Clear any error states
            inputs.forEach(input => {
                input.classList.remove('error');
            });
        }, 2000);
    }

    function showSuccessMessage() {
        // Create success message
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <div style="background: #d4edda; color: #155724; padding: 15px; border-radius: 6px; margin: 20px 0; border: 1px solid #c3e6cb;">
                <i class="fas fa-check-circle"></i> 
                Hackathon created successfully! You will receive a confirmation email shortly.
            </div>
        `;
        
        // Insert before the form
        form.parentNode.insertBefore(successDiv, form);
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }

    // Add some interactive features
    categorySelect.addEventListener('change', function() {
        if (this.value) {
            this.classList.add('selected');
        } else {
            this.classList.remove('selected');
        }
    });

    venueSelect.addEventListener('change', function() {
        if (this.value) {
            this.classList.add('selected');
        } else {
            this.classList.remove('selected');
        }
    });

    // Add character counter for description
    const descriptionTextarea = document.getElementById('hackathon-desc');
    if (descriptionTextarea) {
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.style.textAlign = 'right';
        counter.style.fontSize = '0.8rem';
        counter.style.color = '#666';
        counter.style.marginTop = '5px';
        descriptionTextarea.parentNode.appendChild(counter);
        
        function updateCounter() {
            const remaining = 500 - descriptionTextarea.value.length;
            counter.textContent = `${remaining} characters remaining`;
            counter.style.color = remaining < 50 ? '#dc3545' : '#666';
        }
        
        descriptionTextarea.addEventListener('input', updateCounter);
        updateCounter();
    }
}); 