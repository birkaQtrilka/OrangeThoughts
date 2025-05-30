interface ArticleData {
    html: HTMLElement;
    navHtml: HTMLElement;
    tags: Tag[];
}

class Tag {
    html: HTMLElement;
    active: boolean;
    articles: ArticleData[];
    btnHtml?: HTMLElement;

    constructor(html: HTMLElement, active: boolean, articles: ArticleData[] = [], btnHtml?: HTMLElement) {
        this.html = html;
        this.active = active;
        this.articles = articles;
        this.btnHtml = btnHtml;
    }
}

const list = document.querySelector("main nav div ul") as HTMLElement;
const tags = new Map<string, Tag>();
const tagContainer = document.querySelector("main>section>ul") as HTMLElement;
const articles = document.querySelectorAll<HTMLElement>("main>article");

articles.forEach(article => {
    const li = document.createElement("li");
    li.classList.add("clickable", "btn", "orangeAnim");
    li.innerHTML = (article.querySelector("h1") as HTMLElement).innerHTML;
    list.appendChild(li);
    li.addEventListener("click", () => {
        const yOffset = -100;
        const y = article.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
    });

    const articleData: ArticleData = {
        html: article,
        navHtml: li,
        tags: []
    };

    article.querySelectorAll(".tags div p").forEach(tag => {
        const tagText = tag.textContent || "";
        if (tags.has(tagText)) {
            const td = tags.get(tagText)!;
            articleData.tags.push(td);
            td.articles.push(articleData);
            return;
        }

        const tagData = new Tag(tag as HTMLElement, true);
        tags.set(tagText, tagData);
        articleData.tags.push(tagData);
        tagData.articles.push(articleData);

        initTagButton(tagData);
    });
});

const enablers = tagContainer.parentElement!.querySelectorAll("div p");
enablers[0].addEventListener('click', () => {
    tags.forEach(t => enableTag(t));
});
enablers[1].addEventListener('click', () => {
    tags.forEach(t => disableTag(t));
});

function initTagButton(tag: Tag) {
    const htmlTagBtn = document.createElement("li");
    htmlTagBtn.classList.add("clickable", "btn", "activeTag");
    htmlTagBtn.innerText = tag.html.innerText;
    tagContainer.appendChild(htmlTagBtn);
    htmlTagBtn.style.setProperty('padding-top', '2px');
    htmlTagBtn.style.setProperty('padding-bottom', '2px');
    tag.btnHtml = htmlTagBtn;

    htmlTagBtn.addEventListener("click", () => {
        const current = tags.get(htmlTagBtn.innerText);
        if (!current) return;
        current.active ? disableTag(current) : enableTag(current);
    });
}

function enableTag(tag: Tag) {
    if (tag.active) return;
    tag.active = true;
    tag.articles.forEach(article => {
        showElement(article.html);
        showElement(article.navHtml);
    });
    tag.btnHtml?.classList.add("activeTag");
}

function disableTag(tag: Tag) {
    if (!tag.active) return;
    tag.active = false;
    tag.btnHtml?.classList.remove("activeTag");

    const closedArticles = tag.articles.filter(a => !a.tags.some(t => t.active));
    if (closedArticles.length === 0) return;

    closedArticles.forEach(a => {
        hideElement(a.html);
        hideElement(a.navHtml);
    });
}

function hideElement(el: HTMLElement) {
    const sectionHeight = el.scrollHeight;
    el.style.height = sectionHeight + "px";
    el.offsetHeight;
    el.classList.add("hide-animate");
    el.style.height = "0px";

    const handler = () => {
        el.style.display = "none";
        el.classList.remove("hide-animate");
        el.style.height = "";
        el.removeEventListener("transitionend", handler);
    };
    el.addEventListener("transitionend", handler);
}

function showElement(el: HTMLElement) {
    if (el.style.display !== "none") return;
    el.style.display = "block";
    const sectionHeight = el.scrollHeight;
    el.style.height = "0px";
    el.offsetHeight;
    el.style.height = sectionHeight + "px";
    el.classList.add("show-animate");

    const handler = () => {
        el.style.height = "auto";
        el.classList.remove("show-animate");
        el.removeEventListener("transitionend", handler);
    };
    el.addEventListener("transitionend", handler);
}

document.querySelector("main button svg")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
