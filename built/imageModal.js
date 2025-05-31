"use strict";
// Get the modal
const modal = document.getElementById("myModal");
const popUps = document.querySelectorAll("img.popUp");
const modalImg = document.getElementById("img01");
const captionText = document.getElementById("caption");
const span = document.getElementsByClassName("close")[0];
if (modal && popUps && modalImg && captionText && span) {
    function closeModal(modl) {
        modl.style.display = "none";
    }
    popUps.forEach(popUp => {
        popUp.onclick = function () {
            modal.style.display = "block";
            modalImg.src = popUp.src;
            captionText.innerHTML = popUp.alt;
        };
        span.onclick = () => closeModal(modal);
        modal.onclick = () => closeModal(modal);
    });
}
else {
    console.error("One or more DOM elements are missing.");
}
