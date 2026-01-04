// ====================================
// MULTILINGUAL WEBSITE FUNCTIONALITY
// Sai Pooja Pattal Dona Bhandar
// ====================================

// Global Variables
const navbar = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');
const languageToggle = document.getElementById('languageToggle');
const currentLangSpan = document.getElementById('currentLang');

// Default Language
let currentLanguage = localStorage.getItem('language') || 'en';

// ====================================
// LANGUAGE SWITCHING FUNCTIONALITY
// ====================================

function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    // Update all elements with data-lang attribute
    document.querySelectorAll('[data-lang]').forEach(element => {
        const key = element.getAttribute('data-lang');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Update language toggle button
    currentLangSpan.textContent = lang.toUpperCase();
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Show notification
    showNotification(
        lang === 'en' ? 'Language changed to English' : 'भाषा हिंदी में बदली गई',
        'success'
    );
}

// Language Toggle Button
if (languageToggle) {
    languageToggle.addEventListener('click', () => {
        const newLang = currentLanguage === 'en' ? 'hi' : 'en';
        setLanguage(newLang);
    });
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLanguage);
});

// ====================================
// MOBILE MENU TOGGLE
// ====================================

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
    });
}

// Close menu when clicking on links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        if (navToggle) {
            navToggle.classList.remove('active');
        }
        document.body.style.overflow = 'auto';
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-container')) {
        navMenu.classList.remove('active');
        if (navToggle) {
            navToggle.classList.remove('active');
        }
        document.body.style.overflow = 'auto';
    }
});

// ====================================
// NAVBAR SCROLL EFFECT
// ====================================

let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ====================================
// ACTIVE NAVIGATION HIGHLIGHTING
// ====================================

const currentPage = window.location.pathname.split('/').pop() || 'index.html';
navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
        link.classList.add('active');
    }
});

// Section-based active link (for homepage)
const sections = document.querySelectorAll('section[id]');

function highlightNavigation() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 150;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-menu a[href*="${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                if (!link.querySelector('.language-toggle')) {
                    link.classList.remove('active');
                }
            });
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
}

if (sections.length > 0) {
    window.addEventListener('scroll', debounce(highlightNavigation, 50));
}

// ====================================
// SMOOTH SCROLLING
// ====================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        if (href !== '#' && href !== '') {
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const offsetTop = target.offsetTop - 90;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ====================================
// ANIMATED STATS COUNTER
// ====================================

const statNumbers = document.querySelectorAll('.stat-number');
let statsAnimated = false;

function animateCounter(element, target, duration = 2500) {
    let start = 0;
    const increment = target / (duration / 16);
    const suffix = element.textContent.replace(/[0-9,]/g, '');
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = formatNumber(target) + suffix;
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(start)) + suffix;
        }
    }, 16);
}

function formatNumber(num) {
    return num.toLocaleString('en-IN');
}

// Intersection Observer for stats animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
            const statNumber = entry.target;
            const targetValue = parseInt(statNumber.getAttribute('data-target'));
            
            if (targetValue) {
                animateCounter(statNumber, targetValue);
            }
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => {
    statsObserver.observe(stat);
});

// ====================================
// AOS (ANIMATE ON SCROLL) ALTERNATIVE
// ====================================

const animatedElements = document.querySelectorAll('[data-aos]');

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-aos-delay') || 0;
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, delay);
            scrollObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

animatedElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(40px)';
    element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    scrollObserver.observe(element);
});

// ====================================
// CONTACT FORM VALIDATION & SUBMISSION
// ====================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });

    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            showNotification(
                currentLanguage === 'en' 
                    ? 'Please fill all required fields correctly' 
                    : 'कृपया सभी आवश्यक फ़ील्ड सही तरीके से भरें',
                'error'
            );
            return;
        }
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const phone = formData.get('phone');
        const email = formData.get('email') || 'Not provided';
        const orderType = formData.get('orderType') || formData.get('subject');
        const message = formData.get('message');
        const company = formData.get('company') || 'Not provided';
        
        // Create WhatsApp message
        const whatsappNumber = '919893471456';
        const whatsappMessage = encodeURIComponent(
            `*🌟 New Inquiry from Website*\n\n` +
            `*Name:* ${name}\n` +
            `*Company:* ${company}\n` +
            `*Phone:* ${phone}\n` +
            `*Email:* ${email}\n` +
            `*Order Type:* ${orderType}\n` +
            `*Message:* ${message}\n\n` +
            `_Sent from Sai Pooja Website_`
        );
        
        // Show loading
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + 
            (currentLanguage === 'en' ? 'Sending...' : 'भेजा जा रहा है...');
        submitBtn.disabled = true;
        
        // Simulate sending delay
        setTimeout(() => {
            // Open WhatsApp
            window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, '_blank');
            
            // Show success message
            showNotification(
                currentLanguage === 'en' 
                    ? 'Thank you! Redirecting to WhatsApp...' 
                    : 'धन्यवाद! WhatsApp पर भेजा जा रहा है...',
                'success'
            );
            
            // Reset form
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Remove all error states
            inputs.forEach(input => removeError(input));
        }, 1000);
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Remove previous error
    removeError(field);

    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = currentLanguage === 'en' ? 'This field is required' : 'यह फ़ील्ड आवश्यक है';
    }

    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            isValid = false;
            errorMessage = currentLanguage === 'en' 
                ? 'Enter valid 10-digit mobile number' 
                : 'मान्य 10 अंकों का मोबाइल नंबर दर्ज करें';
        }
    }

    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = currentLanguage === 'en' 
                ? 'Enter valid email address' 
                : 'मान्य ईमेल पता दर्ज करें';
        }
    }

    if (!isValid) {
        showError(field, errorMessage);
    }

    return isValid;
}

function showError(field, message) {
    field.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    field.parentElement.appendChild(errorDiv);
}

function removeError(field) {
    field.classList.remove('error');
    const errorMessage = field.parentElement.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function showNotification(message, type) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ====================================
// FAQ ACCORDION
// ====================================

const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    if (question) {
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faq => {
                faq.classList.remove('active');
                const answer = faq.querySelector('.faq-answer');
                if (answer) {
                    answer.style.maxHeight = null;
                }
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
                const answer = item.querySelector('.faq-answer');
                if (answer) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            }
        });
    }
});

// ====================================
// PRODUCT FILTER (For Products Page)
// ====================================

const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Filter products
        productCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// ====================================
// SCROLL TO TOP BUTTON
// ====================================

const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollTopBtn.className = 'scroll-top-btn';
scrollTopBtn.style.display = 'none';
scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', debounce(() => {
    if (window.scrollY > 500) {
        scrollTopBtn.style.display = 'flex';
    } else {
        scrollTopBtn.style.display = 'none';
    }
}, 100));

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ====================================
// LAZY LOADING IMAGES
// ====================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ====================================
// PAGE LOADER
// ====================================

window.addEventListener('load', () => {
    const loader = document.querySelector('.page-loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 300);
    }
    
    // Add loaded class to body
    document.body.classList.add('loaded');
    
    // Animate stats if on viewport
    if (statNumbers.length > 0 && !statsAnimated) {
        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            const rect = statsSection.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom >= 0) {
                statNumbers.forEach(stat => {
                    const targetValue = parseInt(stat.getAttribute('data-target'));
                    if (targetValue) {
                        animateCounter(stat, targetValue);
                    }
                });
                statsAnimated = true;
            }
        }
    }
});

// ====================================
// PREVENT FORM RESUBMISSION
// ====================================

if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

// ====================================
// UTILITY: DEBOUNCE FUNCTION
// ====================================

function debounce(func, wait = 10) {
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

// ====================================
// CONSOLE BRANDING
// ====================================

console.log('%c🌟 Sai Pooja Pattal Dona Bhandar', 'color: #2ecc71; font-size: 24px; font-weight: bold;');
console.log('%cWebsite Loaded Successfully! 🎉', 'color: #27ae60; font-size: 16px; font-weight: bold;');
console.log('%cFor inquiries: +91 98934 71456 | amitm1508@gmail.com', 'color: #34495e; font-size: 12px;');
console.log('%cBuilt with ❤️ for premium disposable products', 'color: #7f8c8d; font-size: 11px;');

// ====================================
// DYNAMIC CSS INJECTION FOR COMPONENTS
// ====================================

const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    /* Notification Styles */
    .notification {
        position: fixed;
        top: 100px;
        right: -450px;
        background: white;
        padding: 1.2rem 2rem;
        border-radius: 15px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 15px;
        z-index: 100000;
        transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        min-width: 350px;
        max-width: 450px;
    }
    
    .notification.show {
        right: 30px;
    }
    
    .notification.success {
        border-left: 5px solid #2ecc71;
    }
    
    .notification.error {
        border-left: 5px solid #e74c3c;
    }
    
    .notification i {
        font-size: 1.8rem;
    }
    
    .notification.success i {
        color: #2ecc71;
    }
    
    .notification.error i {
        color: #e74c3c;
    }
    
    .notification span {
        font-size: 1rem;
        color: #2c3e50;
        font-weight: 500;
    }
    
    /* Form Error Styles */
    .error-message {
        color: #e74c3c;
        font-size: 0.85rem;
        margin-top: 0.5rem;
        display: block;
        animation: shake 0.3s;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    input.error,
    textarea.error,
    select.error {
        border-color: #e74c3c !important;
        animation: shake 0.3s;
    }
    
    /* Scroll to Top Button */
    .scroll-top-btn {
        position: fixed;
        bottom: 120px;
        right: 30px;
        width: 55px;
        height: 55px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 8px 25px rgba(46, 204, 113, 0.4);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 9998;
        font-size: 1.3rem;
    }
    
    .scroll-top-btn:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 35px rgba(46, 204, 113, 0.6);
        background: var(--primary-dark);
    }
    
    /* Mobile Responsive Adjustments */
    @media (max-width: 600px) {
        .notification {
            min-width: 300px;
            right: -350px;
        }
        
        .notification.show {
            right: 15px;
        }
        
        .scroll-top-btn {
            width: 50px;
            height: 50px;
            bottom: 100px;
            right: 20px;
        }
    }
`;
document.head.appendChild(dynamicStyles);

// ====================================
// PERFORMANCE OPTIMIZATION
// ====================================

// Reduce animations on low-power mode
if ('deviceMemory' in navigator && navigator.deviceMemory < 4) {
    document.documentElement.classList.add('reduce-animations');
}

// Prefetch important pages
const prefetchLinks = ['about.html', 'products.html', 'contact.html'];
prefetchLinks.forEach(link => {
    const prefetch = document.createElement('link');
    prefetch.rel = 'prefetch';
    prefetch.href = link;
    document.head.appendChild(prefetch);
});

// ====================================
// SERVICE WORKER REGISTRATION (Optional)
// ====================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(reg => console.log('Service Worker registered'))
        //     .catch(err => console.log('Service Worker registration failed'));
    });
}

// ====================================
// EXPORT FOR TESTING (Optional)
// ====================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        setLanguage,
        validateField,
        showNotification
    };
}


// Smooth scroll to location section
document.addEventListener('DOMContentLoaded', function() {
    // If there's a "Visit Us" or "Location" link in navigation
    const locationLinks = document.querySelectorAll('a[href="#location"]');
    
    locationLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const locationSection = document.getElementById('location');
            if (locationSection) {
                locationSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
