/**
 * Keerthana Tours & Travels - Core Application Script
 * Highly polished, modular vanilla JS script.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 2. Preloader Handler
  const preloader = document.getElementById('preloader');
  if (preloader) {
    // Hide preloader with beautiful fade effect once window loads
    window.addEventListener('load', () => {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    });

    // Fallback: hide preloader after 3 seconds in case window load event is delayed
    setTimeout(() => {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    }, 3000);
  }

  // 3. Sticky Navigation & Back-to-Top Button
  const header = document.getElementById('header');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Toggle Sticky Header
    if (scrollPos > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Toggle Back to Top Button Visibility
    if (scrollPos > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  // Scroll to Top action
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 4. Mobile Hamburger Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close mobile menu when a nav link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // 5. Scroll Spy - Active Navigation Link Highlighting
  const sections = document.querySelectorAll('section[id]');
  
  function scrollSpy() {
    const currentScroll = window.scrollY + 120; // Offset for header & buffer

    sections.forEach(currentSection => {
      const sectionHeight = currentSection.offsetHeight;
      const sectionTop = currentSection.offsetTop;
      const sectionId = currentSection.getAttribute('id');
      const associatedLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (associatedLink) {
        if (currentScroll >= sectionTop && currentScroll < sectionTop + sectionHeight) {
          navLinks.forEach(link => link.classList.remove('active'));
          associatedLink.classList.add('active');
        }
      }
    });
  }
  
  window.addEventListener('scroll', scrollSpy);

  // 6. Intersection Observer - Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.reveal-fade-up');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // Reveal only once
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters viewport
    });

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(element => {
      element.classList.add('revealed');
    });
  }

  // 7. Interactive Vehicle Book Click Hook & Tag Options Handler
  const fleetBookBtns = document.querySelectorAll('.btn-fleet-book, .btn-select-price');
  const vehicleInput = document.getElementById('select-vehicle');
  const vehicleTags = document.querySelectorAll('.vehicle-tag-btn');

  // Helper function to update the tags active state based on current input value
  function updateTagHighlight(currentVal) {
    vehicleTags.forEach(tag => {
      const tagVal = tag.getAttribute('data-value');
      if (currentVal && (currentVal.toLowerCase() === tagVal.toLowerCase() || tagVal.toLowerCase().includes(currentVal.toLowerCase()) || currentVal.toLowerCase().includes(tagVal.toLowerCase()))) {
        tag.classList.add('active');
      } else {
        tag.classList.remove('active');
      }
    });
  }

  // Handle clicks on quick option tags
  vehicleTags.forEach(tag => {
    tag.addEventListener('click', () => {
      const tagVal = tag.getAttribute('data-value');
      if (vehicleInput) {
        vehicleInput.value = tagVal;
        updateTagHighlight(tagVal);
        
        // Custom ripple feedback/focus effect on input wrapper
        const inputWrapper = vehicleInput.closest('.input-wrapper');
        if (inputWrapper) {
          inputWrapper.classList.add('highlight-pulse');
          setTimeout(() => {
            inputWrapper.classList.remove('highlight-pulse');
          }, 1500);
        }
      }
    });
  });

  // Highlight tag if user types a matching value
  if (vehicleInput) {
    vehicleInput.addEventListener('input', (e) => {
      updateTagHighlight(e.target.value);
    });
  }

  // Handle vehicle book clicks from Fleet cards or Pricing cards
  fleetBookBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const vehicleVal = btn.getAttribute('data-vehicle');
      
      if (vehicleVal && vehicleInput) {
        // Map short identifier from data-vehicle attribute to full elegant option string
        let fullVehicleName = vehicleVal;
        if (vehicleVal === 'Sedan') fullVehicleName = 'Sedan (Dzire / Etios)';
        else if (vehicleVal === 'Ertiga') fullVehicleName = 'Maruti Suzuki Ertiga';
        else if (vehicleVal === 'Toyota Innova') fullVehicleName = 'Toyota Innova';
        else if (vehicleVal === 'Innova Crysta') fullVehicleName = 'Toyota Innova Crysta';
        else if (vehicleVal === 'Tempo Traveller') fullVehicleName = 'Tempo Traveller';
        else if (vehicleVal === 'Mini Bus') fullVehicleName = 'Luxury Mini Bus / Coach';

        vehicleInput.value = fullVehicleName;
        updateTagHighlight(fullVehicleName);
        
        // Custom ripple feedback/focus effect
        const inputWrapper = vehicleInput.closest('.input-wrapper');
        if (inputWrapper) {
          inputWrapper.classList.add('highlight-pulse');
          setTimeout(() => {
            inputWrapper.classList.remove('highlight-pulse');
          }, 1500);
        }
      }
    });
  });

  // 8. Custom Form Submission (Real Integration to WhatsApp API)
  const bookingForm = document.getElementById('booking-form');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault(); // Prevent standard page reload

      // Collect data from inputs
      const fullName = document.getElementById('full-name').value.trim();
      const phoneNumber = document.getElementById('phone-number').value.trim();
      const vehicle = document.getElementById('select-vehicle').value;
      const tripType = document.getElementById('trip-type').value;
      const date = document.getElementById('journey-date').value;
      const pickupLocation = document.getElementById('pickup-location').value.trim();
      const instructions = document.getElementById('special-instructions').value.trim();

      // Simple validation double check
      if (!fullName || !phoneNumber || !vehicle || !tripType || !date || !pickupLocation) {
        alert('Please fill out all required fields marked with *');
        return;
      }

      // Format Date nicely (DD-MM-YYYY)
      let formattedDate = date;
      try {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        formattedDate = `${day}-${month}-${year}`;
      } catch (err) {
        // Fallback to original
      }

      // Build highly readable message body
      let message = `*NEW BOOKING REQUEST - KEERTHANA TRAVELS*\n`;
      message += `-------------------------------------------\n`;
      message += `👤 *Client Name:* ${fullName}\n`;
      message += `📞 *WhatsApp/Phone:* ${phoneNumber}\n`;
      message += `🚘 *Vehicle Requested:* ${vehicle}\n`;
      message += `🗺️ *Trip Type:* ${tripType}\n`;
      message += `📅 *Journey Date:* ${formattedDate}\n`;
      message += `📍 *Pickup Location:* ${pickupLocation}\n`;
      
      if (instructions) {
        message += `✉️ *Special Instructions/Route:* ${instructions}\n`;
      }
      message += `-------------------------------------------\n`;
      message += `_Submitted via Keerthana Tours & Travels online portal._`;

      // URL encode the message
      const encodedMessage = encodeURIComponent(message);
      
      // Keerthana's verified WhatsApp business number
      const whatsappNumber = '9193712345';
      const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

      // Show temporary booking state or loading feedback
      const submitBtn = bookingForm.querySelector('.btn-submit');
      const originalBtnHTML = submitBtn.innerHTML;
      
      submitBtn.innerHTML = `
        <div class="preloader-spinner" style="width: 20px; height: 20px; margin-bottom: 0; display: inline-block; vertical-align: middle;"></div>
        <span style="margin-left: 8px;">Opening WhatsApp...</span>
      `;
      submitBtn.style.pointerEvents = 'none';
      submitBtn.style.opacity = '0.8';

      setTimeout(() => {
        // Open in new tab securely
        window.open(whatsappURL, '_blank', 'noopener,noreferrer');
        
        // Reset submit button state
        submitBtn.innerHTML = originalBtnHTML;
        submitBtn.style.pointerEvents = 'auto';
        submitBtn.style.opacity = '1';
        
        // Optional: clear form fields or show success dialogue
        bookingForm.reset();
      }, 1000);
    });
  }

  // 9. Extra UI Decorators: Add dynamic highlighting class to highlight active card elements
  const cards = document.querySelectorAll('.service-card, .fleet-card, .pricing-card, .why-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-8px)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // Log setup complete for debug
  console.log('Keerthana Travels - Premium UI Engaged');
});
