class InScrollRange
{
    range:number;
    offset:number;
    container:HTMLElement;
    callback: (value:number) => void;

    constructor(range:number, offset:number, container:HTMLElement, callback: (value:number) => void)
    {
        this.range = range;
        this.container = container;
        this.offset = offset;
        this.callback = callback;
        window.addEventListener('scroll', ()=>
        {
            const rect = this.container.getBoundingClientRect() ;
            let t = (rect.y + this.offset) /  this.range;
            t= clamp(t, -1,1) ;
            this.callback(t);
        });
    }

}
function clamp(num:number, min:number, max:number) 
{
    return Math.min(Math.max(num, min), max);
}

//shine 
document.querySelectorAll<HTMLElement>('.glossy-container').forEach(container => {
    const range = 300;
    container.querySelectorAll<HTMLElement>('.glossy-shine').forEach(shine => {
        
        new InScrollRange(range,-window.innerHeight/3, container, (t)=> {
            t *= 100;
            shine.style.transform = `translate(${t}%, ${t}%)`;
        })
    });
});

//text (and not only) scale
document.querySelectorAll<HTMLElement>('.scaleInRange').forEach(container => {
    const range = window.innerHeight;
    const attr = container?.getAttribute("data-offset");
    const offset = attr !== null ? +attr : 250;

    new InScrollRange(range, -offset, container, (t)=> {
        t = clamp(t,0,.5);
        container.style.transform = `scale(${1-t})`
    })
});

