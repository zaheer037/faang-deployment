document.addEventListener('DOMContentLoaded', () => {
    // Get references to HTML elements
    const htmlElement = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navbar = document.querySelector('.navbar');
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('form-message');
    const coursesGrid = document.querySelector('.courses-grid'); // Get the courses grid element
    const codegymContentWrapper = document.querySelector('.codegym-content-wrapper'); // Get the CodeGym content wrapper
    // Get the Training the Trainers content wrapper
    const trainingTrainersContentWrapper = document.querySelector('#training-the-trainers .codegym-content-wrapper');


    let coursesScrollInterval; // Variable to hold the interval ID for courses auto-scrolling
    let codegymScrollInterval; // Variable to hold the interval ID for CodeGym auto-scrolling
    let trainersScrollInterval; // Variable to hold the interval ID for Training the Trainers auto-scrolling


    // --- Theme Toggle Functionality ---
    // Function to set the theme based on the provided theme string
    const setTheme = (theme) => {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme); // Save preference to local storage
    };

    // Initialize theme on page load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        // Default to light mode if no preference is saved
        setTheme('light');
    }

    // Add event listener to the theme toggle button
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
        });
    }

    // --- Hamburger menu functionality ---
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // --- Smooth scrolling for navigation links ---
    document.querySelectorAll('.nav-menu a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Calculate offset for fixed header
                const headerOffset = navbar.offsetHeight;
                const offsetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Add sticky/scrolled class to navbar on scroll ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { // Adjust scroll threshold as needed
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Client-side form validation for contact form (without alert()) ---
    // if (contactForm) {
    //     contactForm.addEventListener('submit', function (e) {
    //         e.preventDefault(); // Prevent default form submission

    //         const name = document.getElementById('name').value.trim();
    //         const email = document.getElementById('email').value.trim();
    //         const subject = document.getElementById('subject').value.trim(); // Get subject field
    //         const message = document.getElementById('message').value.trim();

    //         // Clear previous messages
    //         formMessage.textContent = '';
    //         formMessage.classList.remove('success', 'error');
    //         formMessage.style.opacity = 0;

    //         let isValid = true;
    //         let errorMessage = '';

    //         if (name === '' || email === '' || message === '') {
    //             errorMessage += 'Name, Email, and Message are required. ';
    //             isValid = false;
    //         } else {
    //             const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //             if (!emailRegex.test(email)) {
    //                 errorMessage += 'Please enter a valid email address. ';
    //                 isValid = false;
    //             }
    //         }

    //         if (!isValid) {
    //             formMessage.textContent = errorMessage.trim();
    //             formMessage.classList.add('error');
    //             formMessage.style.opacity = 1;
    //         } else {
    //             // Send data to your Spring Boot backend
    //             fetch('/api/contact/submit', { // This is the endpoint URL in your Spring Boot app
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //                 body: JSON.stringify({ name, email, subject, message }),
    //             })
    //             .then(response => {
    //                 if (!response.ok) {
    //                     // Attempt to read error message from backend response
    //                     return response.text().then(text => { throw new Error(text || ' '); });
    //                 }
    //                 return response.text(); // Or .json() if your backend returns JSON
    //             })
    //             .then(data => {
    //                 formMessage.textContent = 'Thank you for your message! We will get back to you soon.';
    //                 formMessage.classList.add('success');
    //                 formMessage.style.opacity = 1;
    //                 this.reset(); // Clear the form after successful submission
    //             })
    //             .catch(error => {
    //                 console.error('There was a problem with the form submission:', error);
    //                 formMessage.textContent = ' ' + error.message;
    //                 formMessage.classList.add('error');
    //                 formMessage.style.opacity = 1;
    //             });
    //         }
    //     });
    // }

    // --- Dynamic active class for navigation menu items based on scroll position ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');

    function highlightNavMenu() {
        let current = '';
        // Get current scroll position
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbar.offsetHeight - 10; // Adjusted offset for better accuracy
            const sectionHeight = section.clientHeight;

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            // Only activate if the href matches the current section ID
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightNavMenu);
    highlightNavMenu(); // Call on load to set initial active link

    // --- Auto-scrolling for horizontal sections ---
    const setupAutoScroll = (element, intervalIdVar) => {
        if (!element) {
            console.warn(`Auto-scroll setup failed: Element not found for ${intervalIdVar}`);
            return;
        }

        // Clear any existing interval to prevent multiple scrolls
        clearInterval(window[intervalIdVar]);

        try {
            window[intervalIdVar] = setInterval(() => {
                if (element && element.scrollLeft !== undefined) {
                    element.scrollLeft += 1; // Scroll by 1 pixel

                    // If scrolled to the end, reset to the beginning
                    // Add a small buffer (e.g., 1px) to prevent flickering at the end
                    if (element.scrollLeft + element.clientWidth >= element.scrollWidth - 1) {
                        element.scrollLeft = 0;
                    }
                }
            }, 20); // Adjust interval for speed (lower value = faster scroll)
        } catch (error) {
            console.error(`Auto-scroll setup failed for ${intervalIdVar}:`, error);
        }
    };

    const stopAutoScroll = (intervalIdVar) => {
        if (window[intervalIdVar]) {
            clearInterval(window[intervalIdVar]);
            window[intervalIdVar] = null;
        }
    };

    // Performance optimization: Only run auto-scroll when element is visible
    const isElementVisible = (element) => {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    };

    // Start auto-scroll for Courses Grid
    setupAutoScroll(coursesGrid, 'coursesScrollInterval');

    // Pause/Resume auto-scroll for Courses Grid on hover/touch
    if (coursesGrid) {
        coursesGrid.addEventListener('mouseover', () => stopAutoScroll('coursesScrollInterval'));
        coursesGrid.addEventListener('mouseout', () => setupAutoScroll(coursesGrid, 'coursesScrollInterval'));
        coursesGrid.addEventListener('touchstart', () => stopAutoScroll('coursesScrollInterval'));
        coursesGrid.addEventListener('touchend', () => setupAutoScroll(coursesGrid, 'coursesScrollInterval'));
    }

    // Start auto-scroll for CodeGym Content Wrapper
    setupAutoScroll(codegymContentWrapper, 'codegymScrollInterval');

    // Pause/Resume auto-scroll for CodeGym Content Wrapper on hover/touch
    if (codegymContentWrapper) {
        codegymContentWrapper.addEventListener('mouseover', () => stopAutoScroll('codegymScrollInterval'));
        codegymContentWrapper.addEventListener('mouseout', () => setupAutoScroll(codegymContentWrapper, 'codegymScrollInterval'));
        codegymContentWrapper.addEventListener('touchstart', () => stopAutoScroll('codegymScrollInterval'));
        codegymContentWrapper.addEventListener('touchend', () => setupAutoScroll(codegymContentWrapper, 'codegymScrollInterval'));
    }

    // Start auto-scroll for Training the Trainers Content Wrapper
    setupAutoScroll(trainingTrainersContentWrapper, 'trainersScrollInterval');

    // Pause/Resume auto-scroll for Training the Trainers Content Wrapper on hover/touch
    if (trainingTrainersContentWrapper) {
        trainingTrainersContentWrapper.addEventListener('mouseover', () => stopAutoScroll('trainersScrollInterval'));
        trainingTrainersContentWrapper.addEventListener('mouseout', () => setupAutoScroll(trainingTrainersContentWrapper, 'trainersScrollInterval'));
        trainingTrainersContentWrapper.addEventListener('touchstart', () => stopAutoScroll('trainersScrollInterval'));
        trainingTrainersContentWrapper.addEventListener('touchend', () => setupAutoScroll(trainingTrainersContentWrapper, 'trainersScrollInterval'));
    }


    // Ensure page lands on home section on initial load
    // Only scroll to top if not navigating to a specific hash from the URL
    if (window.location.hash === '') {
        window.scrollTo(0, 0);
    }
        // --- EmailJS contact form integration ---
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            //const subject = document.getElementById('subject').value.trim();
            const course = document.getElementById('course').value.trim();

            formMessage.textContent = '';
            formMessage.classList.remove('success', 'error');
            formMessage.style.opacity = 0;

            let isValid = true;
            let errorMessage = '';

            if (name === '' || email === '' || phone === '' || course === '') {
                errorMessage += 'Name, Email, Phone Number, and Course selection are required. ';
                isValid = false;
            } else {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    errorMessage += 'Please enter a valid email address. ';
                    isValid = false;
                }

                // Enhanced phone number validation (supports international formats)
                const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');
                const phoneRegex = /^[1-9]\d{7,14}$/; // 8-15 digits, no leading zero
                if (!phoneRegex.test(cleanPhone)) {
                    errorMessage += 'Please enter a valid phone number (8-15 digits). ';
                    isValid = false;
                }
            }

            if (!isValid) {
                formMessage.textContent = errorMessage.trim();
                formMessage.classList.add('error');
                formMessage.style.opacity = 1;
            } else {
                emailjs.sendForm('service_1270jkg', 'template_nw5awxg', contactForm)
                    .then(function(response) {
                        formMessage.textContent = ' Message sent successfully!';
                        formMessage.classList.add('success');
                        formMessage.style.color = 'green';
                        formMessage.style.opacity = 1;
                        contactForm.reset();
                    }, function(error) {
                        console.error('EmailJS error:', error);
                        formMessage.textContent = '❌ Failed to send message. Please try again later.';
                        formMessage.classList.add('error');
                        formMessage.style.color = 'red';
                        formMessage.style.opacity = 1;
                    });
            }
        });
    }

    // --- Promotional Popup Modal Functionality ---
    const popupOverlay = document.getElementById('promotional-popup');
    const popupModal = popupOverlay?.querySelector('.popup-modal');
    const popupCloseBtn = popupOverlay?.querySelector('.popup-close');
    
    // Check if popup should be shown (once per session)
    const popupShownKey = 'faang-popup-shown';
    const popupShown = sessionStorage.getItem(popupShownKey);
    
    function showPopup() {
        if (popupOverlay && !popupShown) {
            popupOverlay.style.display = 'flex';
            // Small delay to ensure display is set before adding show class
            setTimeout(() => {
                popupOverlay.classList.add('show');
            }, 50);
            
            // Mark as shown in session storage
            sessionStorage.setItem(popupShownKey, 'true');
        }
    }
    
    function hidePopup() {
        if (popupOverlay) {
            popupOverlay.classList.remove('show');
            setTimeout(() => {
                popupOverlay.style.display = 'none';
            }, 400); // Match the CSS transition duration
        }
    }
    
    function redirectToContact() {
        hidePopup();
        // Small delay before redirect to allow close animation
        setTimeout(() => {
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                // Calculate offset for fixed header
                const headerOffset = navbar.offsetHeight;
                const offsetPosition = contactSection.getBoundingClientRect().top + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }, 500);
    }
    
    // Show popup after 2-3 seconds delay (random between 2-3 seconds)
    const showDelay = Math.random() * 1000 + 2000; // 2000-3000ms
    setTimeout(showPopup, showDelay);
    
    // Close popup when clicking the close button
    if (popupCloseBtn) {
        popupCloseBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            hidePopup();
        });
    }
    
    // Close popup when clicking outside the modal
    if (popupOverlay) {
        popupOverlay.addEventListener('click', function(e) {
            if (e.target === popupOverlay) {
                hidePopup();
            }
        });
    }
    
    // Redirect to contact when clicking on the modal (but not close button)
    if (popupModal) {
        popupModal.addEventListener('click', function(e) {
            // Don't redirect if clicking the close button
            if (!e.target.closest('.popup-close')) {
                redirectToContact();
            }
        });
    }
    
    // Close popup with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && popupOverlay && popupOverlay.classList.contains('show')) {
            hidePopup();
        }
    });
});
