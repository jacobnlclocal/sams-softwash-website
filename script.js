/**
 * Sam's Softwash Website - Main JavaScript
 * Handles navigation, animations, and form functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initNavigation();
    initSmoothScroll();
    initScrollReveal();
    initContactForm();
});

/**
 * Navigation Module
 * Handles sticky nav, mobile toggle, and active states
 */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky navigation on scroll
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add scrolled class when past hero
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Update active nav link on scroll
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

/**
 * Smooth Scroll Module
 * Handles smooth scrolling for anchor links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            const navbarHeight = document.getElementById('navbar').offsetHeight;
            const targetPosition = targetElement.offsetTop - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/**
 * Scroll Reveal Module
 * Animates elements as they enter viewport
 */
function initScrollReveal() {
    // Add reveal class to elements we want to animate
    const revealElements = document.querySelectorAll(
        '.service-card, .about-feature, .why-card, .area-item, .testimonial-card, .contact-method, .blog-card, .sidebar-widget, .author-bio'
    );

    revealElements.forEach(el => {
        el.classList.add('reveal');
    });

    // Intersection Observer for reveal animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optionally unobserve after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all reveal elements
    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });

    // Stagger animation for grid items
    const staggerContainers = document.querySelectorAll('.services-grid, .why-grid, .areas-list, .testimonials-grid, .blog-grid, .blog-listing-grid, .blog-related-grid');

    staggerContainers.forEach(container => {
        const items = container.querySelectorAll('.reveal');
        items.forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.1}s`;
        });
    });
}

/**
 * Contact Form Module
 * Handles form validation for Formspree submission
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Basic validation
        const errors = validateForm(data);

        if (errors.length > 0) {
            e.preventDefault();
            showFormErrors(errors);
            return;
        }

        // Form will submit naturally to Formspree
        // Show loading state on button
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
    });

    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

/**
 * Validate entire form
 */
function validateForm(data) {
    const errors = [];

    if (!data.firstName || data.firstName.trim() === '') {
        errors.push({ field: 'firstName', message: 'First name is required' });
    }

    if (!data.lastName || data.lastName.trim() === '') {
        errors.push({ field: 'lastName', message: 'Last name is required' });
    }

    if (!data.email || !isValidEmail(data.email)) {
        errors.push({ field: 'email', message: 'Please enter a valid email address' });
    }

    if (!data.phone || !isValidPhone(data.phone)) {
        errors.push({ field: 'phone', message: 'Please enter a valid phone number' });
    }

    return errors;
}

/**
 * Validate individual field
 */
function validateField(field) {
    const value = field.value.trim();
    const name = field.name;
    let isValid = true;
    let message = '';

    switch (name) {
        case 'firstName':
        case 'lastName':
            if (!value) {
                isValid = false;
                message = `${name === 'firstName' ? 'First' : 'Last'} name is required`;
            }
            break;
        case 'email':
            if (!isValidEmail(value)) {
                isValid = false;
                message = 'Please enter a valid email address';
            }
            break;
        case 'phone':
            if (value && !isValidPhone(value)) {
                isValid = false;
                message = 'Please enter a valid phone number';
            }
            break;
    }

    if (!isValid) {
        showFieldError(field, message);
    } else {
        clearFieldError(field);
    }

    return isValid;
}

/**
 * Show error for specific field
 */
function showFieldError(field, message) {
    clearFieldError(field);

    field.classList.add('error');

    const errorEl = document.createElement('span');
    errorEl.className = 'field-error';
    errorEl.textContent = message;
    errorEl.style.cssText = 'color: #dc3545; font-size: 0.8125rem; margin-top: 0.25rem; display: block;';

    field.parentNode.appendChild(errorEl);
}

/**
 * Clear error for specific field
 */
function clearFieldError(field) {
    field.classList.remove('error');
    const errorEl = field.parentNode.querySelector('.field-error');
    if (errorEl) {
        errorEl.remove();
    }
}

/**
 * Show form errors
 */
function showFormErrors(errors) {
    errors.forEach(error => {
        const field = document.querySelector(`[name="${error.field}"]`);
        if (field) {
            showFieldError(field, error.message);
        }
    });
}

/**
 * Email validation helper
 */
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Phone validation helper
 */
function isValidPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15;
}

/**
 * Debounce helper function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Add CSS for form error states
 */
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #dc3545;
        box-shadow: 0 0 0 4px rgba(220, 53, 69, 0.1);
    }

    .nav-link.active::after {
        width: 100%;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(styleSheet);
