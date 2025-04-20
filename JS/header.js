let ctx;
const stars = [];
const rotationSpeed = {min: .001, max: .006};
const twinnkleSpeed = {min: .001, max: .003};
const parallax = 0.007;
let starExceptions;
let lastScrollValue;
//let bodyWrapper;
let canvas;

function getBodyWrapper()
{
    //if(bodyWrapper === undefined)
    //    bodyWrapper = document.querySelector("#bodyWrapper");
    return document.body;
}

function exp(x)
{
    return x*x;
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

function initStars(count, minS, maxS) {
    for (let i = 0; i < count; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;

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
    const scrollY = window.scrollY;
    const scrollYDelta = scrollY - lastScrollValue;
    lastScrollValue = scrollY;
    for (let star of stars) {
        star.opacity += star.twinnkleSpeed;
        star.rotation += star.rotSpeed;
        star.y += -scrollYDelta * star.scrollFactor;
        if (star.opacity > 1 || star.opacity < 0.2) star.twinnkleSpeed *= -1;

        if(starExceptions.some(e => isPointInsideElement(star.x, star.y, e))) continue;

        const size = star.size;
        ctx.save(); 
        ctx.translate(star.x, star.y);    
        ctx.scale(star.opacity+.2, star.opacity+.2);
        ctx.rotate(star.rotation);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fillRect(-size / 2, -size / 2, size, size); 

        ctx.restore(); 
    }

    requestAnimationFrame(animateStars);
}

function resizeCanvas() {
    
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.body.scrollHeight;
    resetStars(starExceptions);
}

function createCanvas()
{
    lastScrollValue = window.scrollY;
    canvas = document.createElement("canvas");
    canvas.id = "starCanvas";
    getBodyWrapper().appendChild(canvas);
    ctx = canvas.getContext('2d');
    referenceWidth = document.body.scrollWidth;
    referenceHeight = document.body.scrollHeight;
    //querry returns node list, which doesn't have functions like .some(), so I'm converting it to an array
    starExceptions = [...document.querySelectorAll(".starAvoid")];

    resizeCanvas();
    const resizeObserver = new ResizeObserver(entries => {
        resizeCanvas(); 
    });
    
    resizeObserver.observe(document.body);
    window.addEventListener('resize', resizeCanvas);

    initStars(500, 1, 7);
    requestAnimationFrame(animateStars);
}

window.addEventListener("DOMContentLoaded", () => {
    createCanvas();
    
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

    getBodyWrapper().prepend(header);

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

    getBodyWrapper().append(footer);
    
});

