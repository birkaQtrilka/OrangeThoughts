class Tag
{
    constructor(html, active, articles = [], btnHtml = undefined)
    {
        this.html = html;
        this.active = active;
        this.articles = articles;
        this.btnHtml = btnHtml;
    }
}

const list = document.querySelector("main nav div ul");
const tags = new Map();
const tagContainer = document.querySelector("main>section>ul");
const articles = document.querySelectorAll("main>article");

articles.forEach(article => {
    const li = document.createElement("li");
    li.classList.add("clickable");
    li.classList.add("btn");
    li.classList.add("orangeAnim");
    li.innerHTML = article.querySelector("h1").innerHTML;
    list.appendChild(li);
    li.addEventListener("click", () => {
        const yOffset = -100;
        const y = article.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({ top: y, behavior: 'smooth' });
    });

    const articleData = {
        html: article,
        navHtml: li,
        tags: []
    }
    //referencing articles to tags (circular reference)
    article.querySelectorAll(".tags div p").forEach(tag => {
        if (tags.has(tag.innerText)) {
            const td = tags.get(tag.innerText);
            articleData.tags.push(td);
            td.articles.push(articleData);
            return;
        }
        const tagData = new Tag(tag, true);
        tags.set(tag.innerText, tagData);

        articleData.tags.push(tagData);
        tagData.articles.push(articleData);

        initTagButton(tagData);
    })
    // console.log(articleData.html.querySelector("h1").innerText, articleData.tags.map(t=>{return {name: t.html.innerText, arts: t.articles.map(a=> a.html.querySelector("h1").innerText)}}));

});

//INIT Enablers
const enablers = tagContainer.parentNode.querySelectorAll("div p");
enablers[0].addEventListener('click', ()=>{
    tags.forEach(t => {
        enableTag(t)

    });
});

enablers[1].addEventListener('click', ()=>{
    tags.forEach(t => {
        disableTag(t)

    });
});

function initTagButton(tag)
{
    const htmlTagBtn = document.createElement("li");
    htmlTagBtn.classList.add("clickable");
    htmlTagBtn.classList.add("btn");
    htmlTagBtn.innerText = tag.html.innerText;
    tagContainer.appendChild(htmlTagBtn);
    htmlTagBtn.classList.add("activeTag");
    htmlTagBtn.style.setProperty(
        'padding-top', '2px'
    )
    htmlTagBtn.style.setProperty(
        'padding-bottom', '2px'
    )
    tag.btnHtml = htmlTagBtn;
    htmlTagBtn.addEventListener("click", () => {
        const current = tags.get(htmlTagBtn.innerText);
        if(current.active) disableTag(current);
        else enableTag(current);
    })

}
// document.addEventListener('keypress', function (e) {
//     if (e.key === 'l') {
//         hideElement(articles[0]);
//     }
// });
function enableTag(tag)
{
    if(tag.active) return;
    tag.active = true;
    tag.articles.forEach(article => {
        showElement(article.html);
        showElement(article.navHtml);
    });
    tag.btnHtml.classList.add("activeTag");

}

function disableTag(tag)
{
    if(!tag.active) return;

    tag.active = false;
    tag.btnHtml.classList.remove("activeTag");

    //if any article of this tag has no active tags
    const closedArticles = tag.articles.filter(a => !a.tags.some(t => t.active))
    if (closedArticles.length == 0) return;

    closedArticles.forEach(a => {
        console.log(a.html);
        
        hideElement(a.html);
        hideElement(a.navHtml);
    });
}

function hideElement(el) {
    const sectionHeight = el.scrollHeight;

    el.style.height = sectionHeight + "px"; 
    el.offsetHeight; 
    el.classList.add("hide-animate");
    el.style.height = "0px";

    el.addEventListener("transitionend", function handler() {
        el.style.display = "none";
        el.classList.remove("hide-animate");
        el.style.height = "";
        el.removeEventListener("transitionend", handler);
    });
}

function showElement(el) {
    if(el.style.display !== "none") return;
    el.style.display = "block"; 
    const sectionHeight = el.scrollHeight;
    el.style.height = "0px"; 
    el.offsetHeight; 

    el.style.height = sectionHeight + "px";
    el.classList.add("show-animate");

    el.addEventListener("transitionend", function handler() {
        el.style.height = "auto";
        el.classList.remove("show-animate");
        el.removeEventListener("transitionend", handler);
    });
}

var upButton = document.querySelector("main button img").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});