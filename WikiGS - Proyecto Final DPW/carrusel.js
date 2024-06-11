let nextBtn = document.querySelector('.next')
let prevBtn = document.querySelector('.prev')

let slider = document.querySelector('.slider')
let sliderList = slider.querySelector('.slider .list')
let thumbnail = document.querySelector('.slider .thumbnail')
let thumbnailItems = thumbnail.querySelectorAll('.item')

thumbnail.appendChild(thumbnailItems[0])

// Función par el boton siguiente
nextBtn.onclick = function() {
    moveSlider('next')
}


// funcion para devolver al anterior
prevBtn.onclick = function() {
    moveSlider('prev')
}

// funcion para pasar los sliders
function moveSlider(direction) {
    let sliderItems = sliderList.querySelectorAll('.item')
    let thumbnailItems = document.querySelectorAll('.thumbnail .item')
    
    if(direction === 'next'){
        sliderList.appendChild(sliderItems[0])
        thumbnail.appendChild(thumbnailItems[0])
        slider.classList.add('next')
    } else {
        sliderList.prepend(sliderItems[sliderItems.length - 1])
        thumbnail.prepend(thumbnailItems[thumbnailItems.length - 1])
        slider.classList.add('prev')
    }


    slider.addEventListener('animationend', function() {
        if(direction === 'next'){
            slider.classList.remove('next')
        } else {
            slider.classList.remove('prev')
        }
    }, {once: true}) // Esto remueve el event listener cuando se activa o algo asi


}

const intervalo = 3000;

// Función para que el slide se pase solito eso espero
function moverSlideSolito() {
    nextBtn.click();
}

let sliderIntervalo = setInterval(moverSlideSolito, intervalo);

// Se supone que cuando el mose no este sobre el slider este no se mueve
slider.addEventListener('mouseover', () => {
    clearInterval(sliderIntervalo);
});

slider.addEventListener('mouseout', () => {
    sliderIntervalo = setInterval( moverSlideSolito, intervalo)

});