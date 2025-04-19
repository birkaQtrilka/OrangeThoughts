class InScrollRange
{
    constructor(range,offset, container, callback)
    {
        this.range = range;
        this.container = container;
        this.offset = offset;
        window.addEventListener('scroll', ()=>
        {
            const rect = this.container.getBoundingClientRect() ;
            let t = (rect.y + this.offset) /  this.range;
            t= clamp(t, -1,1) ;
            callback(t);
        });
    }

}

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

document.querySelectorAll('.glossy-container').forEach(container => {
    const shine = container.querySelector('.glossy-shine');
    const range = 300;
    const glossyEffect = new InScrollRange(range, 100, container, (t)=> {
        t *= 100;
        shine.style.transform = `translate(${t}%, ${t}%)`;
    })
});

document.querySelectorAll('.scaleInRange').forEach(container => {
    const range = window.innerHeight;
    const scaleEffect = new InScrollRange(range, -250, container, (t)=> {
        t = clamp(t,0,1);
        
        //shine.style.transform = `none`;
        container.style.transform = `scale(${1-t*.5})`
    })
});