// script.js - Updated for Modern Layout

console.log("Welcome to Saltvt.dev!");

document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded'); // Trigger fade-in

    // Blog Fetch Logic
    const blogContainer = document.getElementById('blogText');
    if (blogContainer) {
        fetch("blog.txt")
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then(text => {
                blogContainer.innerText = text;
            })
            .catch(error => {
                console.error('Error loading blog:', error);
                blogContainer.innerHTML = `<span style="color: #ff6b6b">Error loading blog content.<br>If viewing locally, you may need a Live Server extension due to browser security restrictions.</span>`;
            });
    }

    // Scroll Opacity Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3 // Trigger when 30% visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scrolled-in');
            } else {
                entry.target.classList.remove('scrolled-in'); // Remove to dim out again when scrolling away
            }
        });
    }, observerOptions);

    const bioTexts = document.querySelectorAll('.bio-text');
    bioTexts.forEach(el => observer.observe(el));

    // --- Infinite Scroll Art Loader ---
    const artReference = document.getElementById('art-gallery-container');

    if (artReference) {
        const artContainer = document.querySelector('.hero'); // Appending to hero section
        let artLoaded = false;
        const moreImages = [
            'images/CHIBI COMFY RAE STYLIZED.png',
            'images/chipiBlondeSalt.png'
        ];

        window.addEventListener('scroll', () => {
            if (artLoaded) return;

            // Check if near bottom of page
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
                artLoaded = true; // Prevent multiple loads

                console.log("Loading more art...");

                moreImages.forEach(imgSrc => {
                    const newGalleryDiv = document.createElement('div');
                    newGalleryDiv.className = 'art-gallery';
                    newGalleryDiv.style.opacity = '0'; // Start invisible for fade-in
                    newGalleryDiv.style.animation = 'fadeInUp 1s ease forwards'; // Reuse existing animation

                    const img = document.createElement('img');
                    img.src = imgSrc;
                    img.alt = "Unlockable Art";

                    newGalleryDiv.appendChild(img);
                    artContainer.appendChild(newGalleryDiv);
                });
            }
        });
    }
    // --- Global Cyberpunk Hover Sound ---
    //const hoverSound = new Audio('sounds/hover.mp3');
    //hoverSound.volume = 0.09; // Subtle volume

    document.body.addEventListener('mouseover', (e) => {
        const target = e.target.closest('a, button, .art-gallery, .card, .btn-cta, .footer-socials a');

        // Ensure we only play if we actually hovered over a new interactive element
        // (Simple implementation: play on every mouseover event that matches)
        if (target) {
            // Optional: Debounce or check if it's the same element to avoid spam
            // For now, just reset and play for that "techy" rapid feedback feel
            hoverSound.currentTime = 0;
            hoverSound.play().catch(err => {
                // Ignore autoplay errors (user hasn't interacted yet)
            });
        }
    });

});
