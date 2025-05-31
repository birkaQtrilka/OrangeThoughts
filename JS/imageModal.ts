// Get the modal
const modal = document.getElementById("myModal") as HTMLElement | null;
const popUps = document.querySelectorAll<HTMLImageElement>("img.popUp");
const modalImg = document.getElementById("img01") as HTMLImageElement | null;
const captionText = document.getElementById("caption") as HTMLElement | null;
const span = document.getElementsByClassName("close")[0] as HTMLElement | undefined;

if (modal && popUps && modalImg && captionText && span) {

    function closeModal(modl: HTMLImageElement)
    {
        modl.style.display = "none";

    }

  popUps.forEach(popUp => {
    popUp.onclick = function () {
    modal.style.display = "block";
    modalImg.src = popUp.src;
    captionText.innerHTML = popUp.alt;
  };

  span.onclick = ()=> closeModal(modal as HTMLImageElement);
  modal.onclick = ()=> closeModal(modal as HTMLImageElement);

  });
} else {
  console.error("One or more DOM elements are missing.");
}

