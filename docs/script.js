// Test file for later functionality
// Add clocks, image gallery, forms for email
// Ensure this is a valid timeout value
const timeout = 7000;

            const pageContent = document.getElementById('page-content');

            function fadeIn() {
                pageContent.style.opacity = '0';
                pageContent.style.transition = `opacity ${timeout}ms`;
                setTimeout(() => {
                   pageContent.style.opacity = '1'; 
                }, 0);
            } 

            window.addEventListener('load', () => {
                fadeIn();
            });

            function slideIn() {
                const newPage = document.getElementById('new-page');
                newPage.style.transform = 'translateX(-100%)';
                newPage.style.transition = `transform ${timeout}ms`;
                setTimeout(() => {
                    newPage.style.transform = 'none';
                }, 0);
            }
(async ()=>{
    const text = await((await fetch ("blog.txt")).text());
    document.getElementById('blogText').innerText= text;
})();
