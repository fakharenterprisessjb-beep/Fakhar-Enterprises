// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
if (toggle && nav) {
    toggle.addEventListener('click', () => {
        const open = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
    });
}

// Footer year
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

// Cookie notice (on Home only)
const cookieStrip = document.getElementById('cookieStrip');
const cookieOk = document.getElementById('cookieOk');
const COOKIE_KEY = 'fe_cookie_ok_v1';

if (cookieStrip && cookieOk) {
    // Check if cookie is set
    if (localStorage.getItem(COOKIE_KEY)) {
        cookieStrip.style.display = 'none';
    }

    cookieOk.addEventListener('click', () => {
        // Set cookie and hide strip
        localStorage.setItem(COOKIE_KEY, '1');
        cookieStrip.style.display = 'none';
    });
}

// ----------------------------------------------------
// CONTACT FORM SUBMISSION (using fetch to Formspree)
// ----------------------------------------------------
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    const formButton = contactForm.querySelector('button[type="submit"]');
    // Store original button text to reset it later
    const initialButtonText = formButton.textContent; 

    // Helper to create and insert a success/error message element
    const displayMessage = (text, type = 'success') => {
        // Remove any existing messages first
        const existingMsg = document.getElementById('submission-message');
        if (existingMsg) existingMsg.remove();

        const message = document.createElement('p');
        message.id = 'submission-message';
        message.textContent = text;
        
        let color = '';
        if (type === 'success') {
            color = 'green';
            formButton.classList.remove('btn-accent');
            formButton.classList.add('btn-success'); // For custom styling
        } else {
            color = 'red';
            formButton.classList.remove('btn-accent');
            formButton.classList.add('btn-error'); // For custom styling
        }

        message.style.cssText = `color: ${color}; font-weight: bold; margin-top: 15px;`;
        contactForm.insertAdjacentElement('afterend', message);
    };

    // Helper to reset the form state
    const resetFormState = (delay = 5000) => {
        setTimeout(() => {
            formButton.textContent = initialButtonText;
            formButton.disabled = false;
            formButton.classList.remove('btn-success', 'btn-error');
            formButton.classList.add('btn-accent');
            const msg = document.getElementById('submission-message');
            if (msg) msg.remove();
        }, delay);
    };


    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent the default form action

        // Check if the browser's built-in validation passes
        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }
        
        // 1. Set Loading State
        formButton.disabled = true;
        formButton.textContent = 'Sending...';
        // Clear old messages immediately
        const oldMsg = document.getElementById('submission-message');
        if (oldMsg) oldMsg.remove();

        // 2. Prepare Data (Formspree works best with JSON)
        const data = {
            name: document.getElementById('name').value.trim(),
            // Assuming you've added name="_replyto" to the email input in HTML
            '_replyto': document.getElementById('email').value.trim(), 
            message: document.getElementById('message').value.trim()
        };
        
        try {
            // 3. Submit to Formspree
            const response = await fetch(contactForm.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                // SUCCESS
                displayMessage('Thank you! Your inquiry has been sent successfully. We will be in touch soon. ✅');
                contactForm.reset(); // Clear form fields
                resetFormState(5000); // Reset button after 5 seconds
                
            } else {
                // FORMATION/SERVER FAILURE (e.g., Formspree error)
                let errorMessage = 'An error occurred during submission. Please try again or email us directly.';
                const errorData = await response.json();
                if (errorData && errorData.error) {
                    errorMessage = `Error: ${errorData.error}`;
                }
                
                displayMessage(errorMessage, 'error');
                resetFormState(4000); // Reset button after 4 seconds
            }

        } catch (error) {
            // NETWORK FAILURE
            console.error('Network Error:', error);
            displayMessage('A network error occurred. Please check your connection and try again. ❌', 'error');
            resetFormState(4000); // Reset button after 4 seconds
        }
    };

    // Attach the new submit listener
    contactForm.addEventListener('submit', handleSubmit);
}