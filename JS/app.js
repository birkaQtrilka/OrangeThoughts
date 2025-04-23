const list = document.querySelector("main nav div ul");
const tags = new Map();
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
        const tagData = {
            html: tag,
            active: true,
            articles: []
        };
        tags.set(tag.innerText, tagData);

        articleData.tags.push(tagData);
        tagData.articles.push(articleData);
    })
    // console.log(articleData.html.querySelector("h1").innerText, articleData.tags.map(t=>{return {name: t.html.innerText, arts: t.articles.map(a=> a.html.querySelector("h1").innerText)}}));

});
 const tagContainer = document.querySelector("main>section>ul");
// const enablers = tagContainer.parentElement().querySelectorAll("div p");
// enablers[0].
tags.forEach(tag => {

    const htmlTag = document.createElement("li");
    htmlTag.classList.add("clickable");
    htmlTag.classList.add("btn");
    htmlTag.innerText = tag.html.innerText;
    tagContainer.appendChild(htmlTag);
    htmlTag.classList.add("activeTag");
    htmlTag.style.setProperty(
        'padding-top', '2px'
    )
    htmlTag.style.setProperty(
        'padding-bottom', '2px'
    )
    htmlTag.addEventListener("click", () => {
        const current = tags.get(htmlTag.innerText);
        current.active = !current.active;

        if (current.active) {
            current.articles.forEach(article => {
                article.html.classList.remove("hidden");
                article.navHtml.classList.remove("hidden");
            });
            htmlTag.classList.add("activeTag");

            return;
        }
        htmlTag.classList.remove("activeTag");

        //if any article of this tag has no active tags
        const closedArticles = current.articles.filter(a => !a.tags.some(t => t.active))
        if (closedArticles.length != 0) {
            closedArticles.forEach(a => {
                a.html.classList.add("hidden");
                a.navHtml.classList.add("hidden");

            });
        }
    })
});

var upButton = document.querySelector("main button img").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    console.log("up");

});