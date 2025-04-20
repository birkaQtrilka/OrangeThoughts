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

document.querySelectorAll('.glossy-shine').forEach(shine => {
    const range = 300;
    new InScrollRange(range, -window.innerHeight/3, shine, (t)=> {
        t *= 100;
        shine.style.transform = `translate(${t}%, ${t}%)`;
    })
});

document.querySelectorAll('.scaleInRange').forEach(container => {
    const range = window.innerHeight;
    new InScrollRange(range, -250, container, (t)=> {
        t = clamp(t,0,.5);
        container.style.transform = `scale(${1-t})`
    })
});