
let onSlide = -1;

function nextSlide() {
    onSlide++;

    const children = document.getElementById("slides").children;
    
    if (onSlide >= 0 && onSlide < children.length) {
        const slide = children[onSlide];
        slide.classList.toggle("active-slide");
    }

    if (onSlide - 1 >= 0) {
        const lastSlide = children[onSlide - 1];
        lastSlide.classList.toggle("last-slide");
        lastSlide.classList.toggle("active-slide");
    }

    if (onSlide - 2 >= 0) {
        const twoSlidesAgo = children[onSlide - 2];
        twoSlidesAgo.classList.toggle("last-slide");
    }

    if (onSlide >= children.length) {
        if (onSlide - 1 >= 0) {
            const lastSlide = children[onSlide - 1];
            lastSlide.classList.toggle("last-slide");
        }

        onSlide = -1;
    }
}

function addListenersToButtonControls() {
    const controls = document.getElementsByClassName("slide-controls");

    for (let i = 0; i < controls.length; i++) {
        controls[i].children[0].addEventListener("click", nextSlide);
    }
}

function addButtons() {
    const slideContents = document.getElementsByClassName("slide-content");

    for (let i = 0; i < slideContents.length; i++) {
        const newButtonContainer = document.createElement("div");

        newButtonContainer.classList.add("slide-controls");

        const newButton = document.createElement("button");

        newButton.innerText = i < slideContents.length - 1 ? "Next" : "Close";

        newButtonContainer.appendChild(newButton);

        slideContents[i].appendChild(newButtonContainer);
    }
}

addButtons();
addListenersToButtonControls();

//nextSlide();