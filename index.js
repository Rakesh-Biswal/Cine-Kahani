
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

hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    hamburger.classList.toggle('open');
});


document.getElementById('search-fun2').addEventListener('click',()=>{
    document.querySelector('.search-section').style.display = 'block'; 
});


document.addEventListener('DOMContentLoaded', async () => {

    try {
        const response = await fetch('http://localhost:3000/api/user-visited', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (response.ok) {
            console.log("New User Detected...");
        } else {
            console.error('Error updating user visit count:', data.message);
        }
    } catch (error) {
        console.error('Failed to fetch user visit count:', error);
    }
});


