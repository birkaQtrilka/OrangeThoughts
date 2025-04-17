const list = document.querySelector("main nav div ul");

document.querySelectorAll("main article").forEach(article => {
    const li = document.createElement("li");
    li.classList.add("clickable");
    li.innerHTML = article.querySelector("h1").innerHTML;
    list.appendChild(li);
    li.addEventListener("click", () => {
        const yOffset = -100; 
        const y = article.getBoundingClientRect().top + window.pageYOffset + yOffset;
        
        window.scrollTo({ top: y, behavior: 'smooth' });
    });
});