"use strict";
const stars = [];
let ctx;
const rotationSpeed = { min: .001, max: .006 };
const twinnkleSpeed = { min: .001, max: .003 };
const opasityChange = { min: .2, max: 1 };
const parallax = 0.007;
let starExceptions;
let lastScrollValue;
let canvas;
window.addEventListener("DOMContentLoaded", () => {
    createCanvas();
});
function getBodyWrapper() {
    return document.body;
}
function exp(x) {
    return x * x;
}
function isPointInsideElement(x, y, element) {
    const rect = element.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    x += canvasRect.left;
    y += canvasRect.top;
    return (x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom);
}
function initStars(count, minS, maxS) {
    for (let i = 0; i < count; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * maxS + minS;
        const opasityChange1 = Math.random() * opasityChange.max + opasityChange.min;
        const opasityChange2 = Math.random() * opasityChange.max + opasityChange.min;
        stars.push({
            x: x,
            y: y,
            size: size,
            opacity: Math.random(),
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() * rotationSpeed.max + rotationSpeed.min) * (randomInt(0, 1) == 0 ? 1 : -1),
            twinnkleSpeed: (Math.random() * twinnkleSpeed.max + twinnkleSpeed.min),
            scrollFactor: exp(size) * parallax,
            opasityChange: { min: Math.min(opasityChange1, opasityChange2), max: Math.max(opasityChange1, opasityChange2) },
        });
    }
}
function resetStars(exceptions) {
    stars.forEach(s => {
        let x;
        let y;
        do {
            x = Math.random() * canvas.width;
            y = Math.random() * canvas.height;
        } while (exceptions.some((e) => isPointInsideElement(x, y, e)));
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
        if (star.opacity > star.opasityChange.max || star.opacity < star.opasityChange.min)
            star.twinnkleSpeed *= -1;
        if (starExceptions.some((e) => isPointInsideElement(star.x, star.y, e)))
            continue;
        const size = star.size;
        ctx.save();
        ctx.translate(star.x, star.y);
        ctx.scale(star.opacity + .2, star.opacity + .2);
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
function createCanvas() {
    var _a;
    lastScrollValue = window.scrollY;
    canvas = document.createElement("canvas");
    canvas.id = "starCanvas";
    const dataHolder = document.querySelector("#canvasParams");
    let starCount = dataHolder === null || dataHolder === void 0 ? void 0 : dataHolder.getAttribute("data-starCount");
    starCount !== null && starCount !== void 0 ? starCount : (starCount = "500");
    getBodyWrapper().appendChild(canvas);
    ctx = (_a = canvas.getContext('2d')) !== null && _a !== void 0 ? _a : new CanvasRenderingContext2D();
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
