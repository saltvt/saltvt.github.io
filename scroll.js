const container = document.getElementById('infinite-scroll-container');
const loadMoreBtn = document.getElementById('load-more-btn');

let currentpage =1;
let totalpages=5;

function loadMore() {
    const apiUrl= 'https://'; //figure out backend 
    fetch(apiUrl)
        .then(response => response.json())
        .then(data=> {
            if (data.length >0 ){
                data.forEach(post =>{
                    container.appendChild(document.createElement('div')).innerHTML=post;
                });
                currentpage++;
                loadMoreBtn.disabled= false; // load more data 
                }
            else {
                loadMoreBtn.disabled=true; // no more data 
            })
            .catch(error=> console.error(error));
        }

loadMore();

loadMoreBtn.addEventListener('click', () =>{});
