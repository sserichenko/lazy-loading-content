"use-strict"

const lazyImages = document.querySelectorAll('img[data-src]');
const loadMapBlock = document.querySelector('.map-wrapper');
const windowHeight = document.documentElement.clientHeight;
const loadMoreBlock = document.querySelector('._load-more');

window.addEventListener('scroll', lazyScroll);

let lazyImagesPositions = [];

if(lazyImages.length > 0){
    lazyImages.forEach(img => {
        if(img.dataset.src){
            lazyImagesPositions.push(img.getBoundingClientRect().top + pageYOffset)
            lazyScrollCheck();
        }
    })
}

function lazyScroll(){
    if(document.querySelectorAll('img[data-src]').length > 0){
        lazyScrollCheck();
    }
    if(!loadMapBlock.classList.contains('_loaded')){
        getLazyMap();
    }
    if(!loadMoreBlock.classList.contains('loading')){
        loadMore();
    }
}

function lazyScrollCheck(){
    let imgIndex = lazyImagesPositions.findIndex(item => 
        pageYOffset > item - windowHeight
    );
    if(imgIndex >= 0){
        if(lazyImages[imgIndex].dataset.src){
            lazyImages[imgIndex].src = lazyImages[imgIndex].dataset.src;
            lazyImages[imgIndex].removeAttribute('data-src');
        }
        delete lazyImagesPositions[imgIndex];
    }
}

function getLazyMap(){
    const loadMapBlockPosition = loadMapBlock.getBoundingClientRect().top + pageYOffset;
    if(loadMapBlock.dataset.map && pageYOffset > loadMapBlockPosition - windowHeight){
        const loadMapUrl = loadMapBlock.dataset.map;
            if(loadMapUrl){
                loadMapBlock.insertAdjacentHTML("beforeend", 
            `<iframe src=${loadMapUrl} width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>`
            );
            loadMapBlock.classList.add('_loaded');
        }
        
    }
}

function loadMore(){
    const loadMoreBlockPosition = loadMoreBlock.getBoundingClientRect().top + pageYOffset;
    const loadMoreBlockHeight = loadMoreBlock.offsetHeight;

    if(pageYOffset > (loadMoreBlockPosition + loadMoreBlockHeight) - windowHeight){
        getMoreContent();
    }
}

async function getMoreContent(){
    if(!document.querySelector('._info-loading-icon')){
        loadMoreBlock.insertAdjacentHTML("beforeend",
            `<div class="_info-loading-icon"></div>`
        )
        loadMoreBlock.classList.add('loading');
    }
    let response = await fetch('_more.html', {
        method: 'GET'
    })
    if(response.ok){
        let result = await response.text();
        loadMoreBlock.insertAdjacentHTML('beforeend', result);
        loadMoreBlock.classList.remove('loading');
        if(document.querySelector('._info-loading-icon')){
            document.querySelector('._info-loading-icon').remove();
    }
    
    }else {
        alert("Error")
    }
}

