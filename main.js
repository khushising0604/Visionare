// Main JavaScript file for general site functionality

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.createElement('button');
    mobileMenuToggle.classList.add('mobile-menu-toggle');
    mobileMenuToggle.innerHTML = '☰';
    
    const nav = document.querySelector('nav');
    const headerTop = document.querySelector('.header-top');
    
    headerTop.appendChild(mobileMenuToggle);
    
    mobileMenuToggle.addEventListener('click', function() {
        nav.classList.toggle('open');
        mobileMenuToggle.innerHTML = nav.classList.contains('open') ? '✕' : '☰';
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Shop now button in hero section
    const shopNowBtn = document.querySelector('.hero .cta-button');
    if (shopNowBtn) {
        shopNowBtn.addEventListener('click', function() {
            const categoriesSection = document.querySelector('.categories');
            window.scrollTo({
                top: categoriesSection.offsetTop - 100,
                behavior: 'smooth'
            });
        });
    }
});
function tryOnGlasses(glassId) {
    // Get the user image and the overlay container
    const userImage = document.getElementById('user-photo'); // Replace 'user-photo' with the actual ID of the user's uploaded image
    const glassesOverlay = document.querySelector('.glasses-overlay'); // The container that holds the glasses image
    
    // Create the glasses overlay image element
    const glassesImage = document.createElement('img');
    glassesImage.src = `images/products/₹{glassId}.png`;  // Use the correct path based on your folder structure
    glassesImage.alt = glassId;

    // Clear previous glasses overlay, if any
    glassesOverlay.innerHTML = ''; 
    
    // Append the new glasses overlay
    glassesOverlay.appendChild(glassesImage);
    
    // Show the glasses overlay
    glassesOverlay.classList.add('active');
}
let slideIndex = 0;
showSlides();

function showSlides() {
  const slides = document.getElementsByClassName("mySlides");
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  slideIndex++;
  if (slideIndex > slides.length) {
    slideIndex = 1;
  }

  slides[slideIndex - 1].style.display = "block";
  setTimeout(showSlides, 2000); // Change image every 3 seconds
}

// Get the subscribe button and form
const subscribeButton = document.querySelector('.newsletter-form button');
const emailInput = document.querySelector('.newsletter-form input');
const messageContainer = document.createElement('div'); // Message container

// Add an event listener for the subscribe button
subscribeButton.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent form submission (if used in a form)

    // Check if the email field is not empty
    if (emailInput.value.trim() !== '') {
        // Create the message and add it to the page
        messageContainer.innerHTML = `<p>Thank you for subscribing! We'll keep you updated.</p>`;
        messageContainer.style.color = '#4CAF50'; // Green color for success message
        messageContainer.style.fontSize = '1rem';
        messageContainer.style.marginTop = '20px';
        messageContainer.style.textAlign = 'center';

        // Add the message to the newsletter section
        document.querySelector('.newsletter').appendChild(messageContainer);

        // Clear the email input field
        emailInput.value = '';
    } else {
        // If email is empty, show an error message
        messageContainer.innerHTML = `<p style="color: red;">Please enter a valid email address.</p>`;
        document.querySelector('.newsletter').appendChild(messageContainer);
    }
});


// Handle Star Rating Click
// Handle Star Rating Click
document.querySelectorAll('.star').forEach(star => {
    star.addEventListener('click', () => {
      let rating = star.getAttribute('data-value');
      
      // Highlight stars up to the clicked one
      document.querySelectorAll('.star').forEach(s => {
        s.classList.remove('selected');
        if (s.getAttribute('data-value') <= rating) {
          s.classList.add('selected');
        }
      });
    });
  });
  
  // Handle Feedback Form Submission
  document.getElementById('submit-feedback').addEventListener('click', (event) => {
    event.preventDefault();  // Prevent page reload
    
    let rating = document.querySelectorAll('.star.selected').length;
    let feedbackText = document.getElementById('feedback-text').value;
    
    console.log('Rating:', rating); // For debugging purposes
    console.log('Feedback:', feedbackText); // For debugging purposes
    
    // Show thank you message and clear fields
    let thankYouMessage = document.getElementById('thank-you-message');
    thankYouMessage.style.display = 'block';  // Make the message visible
    thankYouMessage.style.opacity = '1';     // Ensure the message is shown
    document.getElementById('feedback-text').value = '';  // Clear the text area
  });
  
// Get the button element and the current dark mode setting
const darkModeButton = document.getElementById('darkModeToggle');

// Check if dark mode was previously enabled and apply it if so
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    darkModeButton.textContent = 'Disable Dark Mode'; // Change button text
}

// Add event listener to the button to toggle dark mode
darkModeButton.addEventListener('click', function () {
    if (document.body.classList.contains('dark-mode')) {
        // If dark mode is already enabled, disable it
        document.body.classList.remove('dark-mode');
        darkModeButton.textContent = 'Enable Dark Mode'; // Change button text
        localStorage.setItem('theme', 'light'); // Save state in localStorage
    } else {
        // If dark mode is not enabled, enable it
        document.body.classList.add('dark-mode');
        darkModeButton.textContent = 'Disable Dark Mode'; // Change button text
        localStorage.setItem('theme', 'dark'); // Save state in localStorage
    }
});





  