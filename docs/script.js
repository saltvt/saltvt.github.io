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
});
