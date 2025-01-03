
// JS code for navbar-scroll view functionality
let lastScrollTop = 0;
const header = document.querySelector('.navbar');

window.addEventListener('scroll', function () {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > lastScrollTop) {
        // Scroll Down - Hide the navbar
        header.classList.add('hide-navbar');
    } else {
        // Scroll Up - Show the navbar
        header.classList.remove('hide-navbar');
    }
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // For Mobile or negative scrolling
});


const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const navItems = document.querySelectorAll('.nav-item, .mobile-item');

// Toggle mobile menu on hamburger click
hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    hamburger.classList.toggle('open');
});

// Reset hamburger and mobile menu on nav item click
navItems.forEach(item => {
    item.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        hamburger.classList.remove('open');
    });
});

document.getElementById('nsb').addEventListener('click',()=>{
    console.log("clicked");
    document.querySelector('.search-section').style.display = 'block'; 
});

document.getElementById('sb').addEventListener('click',()=>{
    console.log("clicked");
    document.querySelector('.search-section').style.display = 'block'; 
});