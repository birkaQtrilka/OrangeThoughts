

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

document.querySelectorAll('.glossy-container').forEach(container => {
    const shine = container.querySelector('.glossy-shine');
    // let animation;
    window.addEventListener('scroll', ()=>
    {
        const range = 300;
        const rect = container.getBoundingClientRect() ;

        let t = (rect.y + 100) /  range;
        
        t= clamp(t, -1,1) * 100;
        // if(t<0) t*=-1;
        console.log(t);
        shine.style.transform = `none`;

        shine.style.transform = `translate(${t}%, ${t}%)`;
    });

    // container.addEventListener('mouseenter', () => {
    //     if (animation) animation.cancel();

    //     animation = shine.animate(
    //         [
    //             { transform: 'translate(-50%, -50%) rotate(25deg)', opacity: 1 },
    //             { transform: 'translate(100%, 100%) rotate(25deg)', opacity: 1 }
    //         ],
    //         {
    //             duration: 1000,
    //             easing: 'ease',
    //             fill: 'forwards'
    //         }
    //     );
    // });

    // container.addEventListener('mouseleave', () => {
    //     if (animation) {
    //         console.log("left during animation");
            
    //         //const currentTime = animation.currentTime;
    //         //const remaining = animation.effect.getComputedTiming().duration - currentTime;

    //         animation.reverse();

    //         // Optional: reset after it finishes
    //         animation.onfinish = () => {
    //             shine.style.opacity = 0;
    //         };
    //     }
    // });
});