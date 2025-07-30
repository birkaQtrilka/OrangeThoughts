const items = document.querySelectorAll('.container main article');
const last = items[items.length - 1];
if ((items.length % 2) === 1) {
    last.classList.add('last-odd');
}