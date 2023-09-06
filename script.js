// Check if the user's browser preference is dark mode
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // Apply dark mode styles
    document.documentElement.setAttribute('data-theme', 'dark');
  };
    
    // Get a reference to the dark mode switch element
    var darkModeSwitch = document.getElementById('dark-mode-switch');

    // Get a reference to the dark mode toggle button
    var darkModeToggle = document.getElementById('dark-mode-toggle');

    // Add a click event listener to the dark mode toggle button
    darkModeToggle.addEventListener('click', function() {
    // Toggle the checked state of the dark mode switch
    darkModeSwitch.checked = !darkModeSwitch.checked;

    // If the switch is checked (dark mode enabled)
    if (darkModeSwitch.checked) {
    document.body.classList.add('dark-mode'); // Apply dark mode styles
    } else {
    document.body.classList.remove('dark-mode'); // Remove dark mode styles
    }
    });

    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    })

    document.querySelectorAll(".nav-link").forEach(n=> n.
      addEventListener("click", () => {
          hamburger.classList.remove("active")
          navMenu.classList.remove("active")
      }))