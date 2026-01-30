
const timeout = 5000;
const bounceOutElement = document.getElementById('bounceOutElement');
const pageContent = document.getElementById('page-content');
//page functions
            

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

            bounceOutElement.addEventListener('mouseover', ()=>{
                bounceOutElement.classList.add('hover');
            });

            bounceOutElement.addEventListener('mouseout', ()=>{
                bounceOutElement.classList.remove('hover');
            });

            //function slideIn() {
              //const newPage = document.getElementById('new-page');
                //newPage.style.transform = 'translateX(-100%)';
                //newPage.style.transition = `transform ${timeout}ms`;
                //setTimeout(() => {
                    //newPage.style.transform = 'none';
                //}, 0);
            //}
(async ()=>{
    const text = await((await fetch ("blog.txt")).text());
    document.getElementById('blogText').innerText= text;
})();
//Add google docs passthrough later 10.27.24

