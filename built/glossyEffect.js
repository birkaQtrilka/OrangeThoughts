"use strict";
class InScrollRange {
    constructor(range, offset, container, callback) {
        this.range = range;
        this.container = container;
        this.offset = offset;
        this.callback = callback;
        window.addEventListener('scroll', () => {
            const rect = this.container.getBoundingClientRect();
            let t = (rect.y + this.offset) / this.range;
            t = clamp(t, -1, 1);
            this.callback(t);
        });
    }
}
function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}
//shine 
document.querySelectorAll('.glossy-container').forEach(container => {
    const range = 300;
    container.querySelectorAll('.glossy-shine').forEach(shine => {
        new InScrollRange(range, -window.innerHeight / 3, container, (t) => {
            t *= 100;
            shine.style.transform = `translate(${t}%, ${t}%)`;
        });
    });
});
//text (and not only) scale
document.querySelectorAll('.scaleInRange').forEach(container => {
    const range = window.innerHeight;
    const attr = container === null || container === void 0 ? void 0 : container.getAttribute("data-offset");
    const offset = attr !== null ? +attr : 250;
    new InScrollRange(range, -offset, container, (t) => {
        t = clamp(t, 0, .5);
        container.style.transform = `scale(${1 - t})`;
    });
});
