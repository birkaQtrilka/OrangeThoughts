let canvas;
let ctx;
const stars = [];
const rotationSpeed = {min: .001, max: .006};
const twinnkleSpeed = {min: .001, max: .003};
const parallax = 0.007;
let starExceptions;

function exp(x)
{
    return x*x;
}

function createWave() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("viewBox", "0 0 1440 320");
    svg.classList.add("starAvoid");
    // Create the <path> element
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("fill", "#152434");
    path.setAttribute("fill-opacity", "1");
    path.setAttribute("d", "M0,288L60,288C120,288,240,288,360,272C480,256,600,224,720,208C840,192,960,192,1080,181.3C1200,171,1320,149,1380,138.7L1440,128L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z");

    // Append the path to the SVG
    svg.appendChild(path);
    // Add the SVG to the page
    document.body.appendChild(svg);
}
function isPointInsideElement(x, y, element) {
    const rect = element.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    x += canvasRect.left;
    y += canvasRect.top;
    return (
      x >= rect.left &&
      x <= rect.right &&
      y >= rect.top &&
      y <= rect.bottom
    );
  }
function initStars(count, minS, maxS, exceptions = []) {
    for (let i = 0; i < count; i++) {
        let x;
        let y;

        do {
            x = Math.random() * canvas.width;
            y = Math.random() * canvas.height;
        } while (
            exceptions.some(e => isPointInsideElement(x, y, e))
        )
        const size = Math.random() * maxS + minS;
        stars.push({
            x: x,
            y: y,
            size: size,
            opacity: Math.random(),
            rotation: Math.random() * Math.PI * 2 ,
            rotSpeed: (Math.random() * rotationSpeed.max + rotationSpeed.min)* (randomInt(0,1) == 0 ?1: -1) ,
            twinnkleSpeed: (Math.random() * twinnkleSpeed.max + twinnkleSpeed.min),
            scrollFactor: exp(size) * parallax,
        });
    }
}

function resetStars(exceptions)
{
    stars.forEach(s => {
        let x;
        let y;

        do {
            x = Math.random() * canvas.width;
            y = Math.random() * canvas.height;
        } while (
            exceptions.some(e => isPointInsideElement(x, y, e))
        )
        s.x = x;
        s.y = y;
    });

}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let star of stars) {
        star.opacity += star.twinnkleSpeed;
        star.rotation += star.rotSpeed;
        if (star.opacity > 1 || star.opacity < 0.2) star.twinnkleSpeed *= -1;
        const size = star.size;
        ctx.save(); // Save the current canvas state
        const scrollY = window.scrollY;
        const offsetY = -scrollY * star.scrollFactor;
        ctx.translate(star.x, star.y + offsetY);    
        ctx.scale(star.opacity+.2, star.opacity+.2);
        ctx.rotate(star.rotation);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fillRect(-size / 2, -size / 2, size, size); // Draw centered square

        ctx.restore(); // Restore state for next star
    }

    requestAnimationFrame(animateStars);
}

function resizeCanvas() {
    
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.body.scrollHeight;
    resetStars(starExceptions);
}

window.addEventListener("DOMContentLoaded", () => {
    createWave();
    
    canvas = document.createElement("canvas");
    canvas.id = "starCanvas";
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    referenceWidth = document.body.scrollWidth;
    referenceHeight = document.body.scrollHeight;
    starExceptions = [...document.querySelectorAll(".starAvoid")];

    resizeCanvas();
    const resizeObserver = new ResizeObserver(entries => {
        resizeCanvas(); // your function
    });
    
    resizeObserver.observe(document.body);
    window.addEventListener('resize', resizeCanvas);
    console.log("drawing");
    //querry returns node list, which doesn't have functions like .some(), so I'm converting it to an array
    initStars(300, 1, 7, starExceptions);
    requestAnimationFrame(animateStars);
    const header = document.createElement("header");
    header.innerHTML = `
        <a href="Index.html#top">
            <img src="Images/Logo.png" alt="pfp">
        </a>
        <nav>
            <ul>
                <li><a class="orangeAnim" href="Index.html#AboutMe">About</a></li>
                <li><a class="orangeAnim" href="Index.html#Projects">Projects</a></li>
            </ul>
            <ul>
                <li>
                    <a href="https://www.linkedin.com/in/stefan-carpeliuc-b2880427b/" target="_blank">
                        <img class="btn orangeImgAnim" src="Images/LinkedInIcon.png" alt="LinkedIn">
                    </a>
                </li>
                <li>
                    <a href="https://github.com/birkaQtrilka" target="_blank">
                        <img class="btn orangeImgAnim" src="Images/gitHubIcon.png" alt="GitHub">
                    </a>
                </li>
            </ul>
        </nav>
    `;

    document.body.prepend(header);

    const footer = document.createElement("footer");

    footer.innerHTML = `
    <footer>
        <ul>
            <li>Spoken languages: English, Romanian, Russian</li>
            <li><a href="#">birkavidit@gmail.com</a></li>
        </ul>
        <ul>
            <li><a href="https://www.instagram.com/orange_thoughtss/" target="_blank">
                <img class="btn orangeImgAnim" src="Images/instaIcon.png" alt="Instagram">
            </a></li>
            <li><a href="https://www.linkedin.com/in/stefan-carpeliuc-b2880427b/" target="_blank">
                <img class="btn orangeImgAnim" src="Images/LinkedInIcon.png" alt="LinkedIn">
            </a></li>
            <li><a href="https://x.com/Birkator" target="_blank">
                <img class="btn orangeImgAnim" src="Images/TwitterIcon.png" alt="Twitter">
            </a></li>
            <li><a href="https://github.com/birkaQtrilka" target="_blank">
                <img class="btn orangeImgAnim" src="Images/gitHubIcon.png" alt="GitHub">
            </a></li>
            <li><a href="https://www.youtube.com/channel/UCuIZf3WkVrkOhyHA0Tin4gg" target="_blank">
                <img class="btn orangeImgAnim" src="Images/icons8-youtube-100.png" alt="YouTube">
            </a></li>
        </ul>
    </footer>
    `;

    document.body.append(footer);
    
});