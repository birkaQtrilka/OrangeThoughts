"use strict";
// scrollScale.js
// Smoothly scales elements pinned to the bottom of the page based on scroll velocity.
// Targets footer images with class .btn and the footer container. Uses requestAnimationFrame for performance.
(function () {
    const settings = {
        // selector for candidate bottom elements anywhere on page
        selector: 'img.btn, a > img.btn, .btn',
        // elements inside this selector will be excluded
        excludeAncestor: 'footer',
        maxScale: 1.18,
        minScale: 0.9,
        velocityScale: 0.0025, // multiplier from scroll delta to scale change
        smoothing: 0.08, // lower = smoother
        idleReturnSpeed: 0.06,
        bottomZone: 0.22, // bottom 22% of viewport is considered "bottom"
    };

    let lastScrollY = window.scrollY;
    let velocity = 0;
    let displayVelocity = 0;
    const allCandidates = () => Array.from(document.querySelectorAll(settings.selector));
    const footer = () => document.querySelector(settings.excludeAncestor);

    function clamp(v, a, b) {
        return Math.max(a, Math.min(b, v));
    }

    function update() {
        const scrollY = window.scrollY;
        const delta = scrollY - lastScrollY;
        lastScrollY = scrollY;
        // Instant velocity is delta per frame; convert to a nicer number
        velocity = delta;
        // Smooth the displayed velocity to avoid jitter
        displayVelocity += (velocity - displayVelocity) * settings.smoothing;

        // Map displayVelocity to a scale factor
        const rawScale = 1 + Math.abs(displayVelocity) * settings.velocityScale;
        // apply limits
        const scale = clamp(rawScale, settings.minScale, settings.maxScale);

        // Slight parallax/translate based on direction
        const translateY = clamp(displayVelocity * -0.08, -6, 6);

        // Select elements that are within the bottom zone of the viewport and are not in the excluded ancestor
        const viewportHeight = window.innerHeight;
        const bottomThreshold = viewportHeight * (1 - settings.bottomZone);
        const candidates = allCandidates().filter(el => {
            // exclude if inside footer
            if (el.closest && el.closest(settings.excludeAncestor))
                return false;
            const rect = el.getBoundingClientRect();
            // consider element if its bottom is below the threshold (i.e. in the bottom zone)
            return rect.bottom >= bottomThreshold && rect.top <= viewportHeight;
        });

        if (candidates.length) {
            // stagger by vertical position (lower elements scale more)
            candidates.forEach((el) => {
                const rect = el.getBoundingClientRect();
                // t=0 at threshold line, t=1 at very bottom
                const t = clamp((rect.bottom - bottomThreshold) / (viewportHeight - bottomThreshold), 0, 1);
                const factor = 0.5 + 0.5 * t; // elements closer to bottom scale more
                const s = 1 + (scale - 1) * factor;
                const ty = translateY * (0.4 + 0.6 * t);
                el.style.transform = `translateY(${ty}px) scale(${s})`;
                el.style.transition = 'transform 140ms linear';
                el.style.willChange = 'transform';
            });
        }

        // Optionally scale the whole footer slightly
        const f = footer();
        if (f) {
            const footScale = 1 + (scale - 1) * 0.08;
            f.style.transform = `scale(${footScale})`;
            f.style.transition = 'transform 200ms linear';
            f.style.willChange = 'transform';
        }

        // decay velocity towards 0 so elements return to normal if scrolling stops
        displayVelocity *= (1 - settings.idleReturnSpeed);

        requestAnimationFrame(update);
    }

    // Initialize after DOM is ready and footer exists
    function initWhenReady() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initWhenReady);
            return;
        }
        // wait until footer is in DOM (header.js creates footer dynamically)
        const tryFind = () => {
            if (document.querySelector(settings.selector) || document.querySelector(settings.footerSelector)) {
                lastScrollY = window.scrollY;
                requestAnimationFrame(update);
            }
            else {
                // retry shortly
                setTimeout(tryFind, 200);
            }
        };
        tryFind();
    }

    initWhenReady();

})();
