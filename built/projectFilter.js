"use strict";
var _a;
class Tag {
    constructor(html, active, articles = [], btnHtml) {
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
//creating navigation list
articles.forEach(article => {
    const li = document.createElement("li");
    li.classList.add("clickable", "btn", "orangeAnim");
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
    };
    article.querySelectorAll(".tags div p").forEach(tag => {
        const tagText = tag.textContent || "";
        if (tags.has(tagText)) {
            const td = tags.get(tagText);
            articleData.tags.push(td);
            td.articles.push(articleData);
            return;
        }
        const tagData = new Tag(tag, true);
        tags.set(tagText, tagData);
        articleData.tags.push(tagData);
        tagData.articles.push(articleData);
        initTagButton(tagData);
    });
});
const enablers = tagContainer.parentElement.querySelectorAll("div p");
//enable all button
enablers[0].addEventListener('click', () => {
    tags.forEach(t => enableTag(t));
});
//disable all button
enablers[1].addEventListener('click', () => {
    tags.forEach(t => disableTag(t));
});
function initTagButton(tag) {
    const htmlTagBtn = document.createElement("li");
    htmlTagBtn.classList.add("clickable", "btn", "activeTag", "tag");
    htmlTagBtn.innerText = tag.html.innerText;
    tagContainer.appendChild(htmlTagBtn);
    htmlTagBtn.style.setProperty('padding-top', '2px');
    htmlTagBtn.style.setProperty('padding-bottom', '2px');
    tag.btnHtml = htmlTagBtn;
    htmlTagBtn.addEventListener("click", () => {
        const current = tags.get(htmlTagBtn.innerText);
        if (!current)
            return;
        current.active ? disableTag(current) : enableTag(current);
    });
}
function enableTag(tag) {
    var _a;
    if (tag.active)
        return;
    tag.active = true;
    tag.articles.forEach(article => {
        showElement(article.html);
        showElement(article.navHtml);
    });
    (_a = tag.btnHtml) === null || _a === void 0 ? void 0 : _a.classList.add("activeTag");
}
function disableTag(tag) {
    var _a;
    if (!tag.active)
        return;
    tag.active = false;
    (_a = tag.btnHtml) === null || _a === void 0 ? void 0 : _a.classList.remove("activeTag");
    const closedArticles = tag.articles.filter(a => !a.tags.some(t => t.active));
    if (closedArticles.length === 0)
        return;
    closedArticles.forEach(a => {
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
    const handler = () => {
        el.style.display = "none";
        el.classList.remove("hide-animate");
        el.style.height = "";
        el.removeEventListener("transitionend", handler);
    };
    el.addEventListener("transitionend", handler);
}
function showElement(el) {
    if (el.style.display !== "none")
        return;
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
(_a = document.querySelector("main button svg")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
