const colors = ['#0e1624', '#baa898', '#B497D6', '#8d98a7', '#D34F73', '#963484','#62A87C', '#F29559', 
    '#1B181D', '#D09D7B', '#715878', '#473A4A'];
let currIndex = 0;
let num;
const root = document.documentElement;

document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        ++currIndex;
        if(currIndex >= colors.length) currIndex = 0;
        num.innerText = currIndex;
        root.style.setProperty('--cardColor', colors[currIndex]);
    }
});
document.addEventListener('keypress', function (e) {
    if (e.key === 'l') {
        --currIndex;
        if(currIndex < 0) currIndex = colors.length-1;
        num.innerText = currIndex;
        root.style.setProperty('--cardColor', colors[currIndex]);
    }
});

window.addEventListener("DOMContentLoaded", () => {
    createCanvas();
    num = document.createElement("p");
    num.id = "Debug";
    document.body.appendChild(num);
    num.innerText = 'aaaaaaaaa';
});