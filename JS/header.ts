window.addEventListener("DOMContentLoaded", () => {

    const header = document.createElement("header");
    header.innerHTML = `
        <a href="index.html#top">
            <img src="Images/Logo.png" alt="pfp">
        </a>
        <nav>
            <ul id="pages">
                <li><a class="orangeAnim" href="index.html#AboutMe">About</a></li>
                <li><a class="orangeAnim" href="index.html#Projects">Projects</a></li>
                <li><a class="orangeAnim" href="Coding adventures.html">Adventures</a></li>
            </ul>
            <ul>
                <li>
                    <svg id="emailBtn" class="orangeHover clickable" width="800px" height="30px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <g>
                        <g>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M7 2.75C5.38503 2.75 3.92465 3.15363 2.86466 4.1379C1.79462 5.13152 1.25 6.60705 1.25 8.5V15.5C1.25 17.393 1.79462 18.8685 2.86466 19.8621C3.92465 20.8464 5.38503 21.25 7 21.25H17C18.615 21.25 20.0754 20.8464 21.1353 19.8621C22.2054 18.8685 22.75 17.393 22.75 15.5V8.5C22.75 6.60705 22.2054 5.13152 21.1353 4.1379C20.0754 3.15363 18.615 2.75 17 2.75H7ZM19.2285 8.3623C19.5562 8.10904 19.6166 7.63802 19.3633 7.31026C19.1101 6.98249 18.6391 6.9221 18.3113 7.17537L12.7642 11.4616C12.3141 11.8095 11.6858 11.8095 11.2356 11.4616L5.6886 7.17537C5.36083 6.9221 4.88982 6.98249 4.63655 7.31026C4.38328 7.63802 4.44367 8.10904 4.77144 8.3623L10.3185 12.6486C11.3089 13.4138 12.691 13.4138 13.6814 12.6486L19.2285 8.3623Z" />
                        </g>
                        </g>
                    </svg>
                    </li>
            </ul>
        </nav>
    `;
    
    getBodyWrapper().prepend(header);
    const emailBtn = document.getElementById("emailBtn");
    
    if (emailBtn) {
        emailBtn.addEventListener("click", () => {
            
            let contactForm = document.getElementById("contact");
            if (contactForm) {
                const yOffset = -100;
                const y = contactForm.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
                return;
            }
            window.location.href = "index.html#contact";
            
        });

        window.addEventListener("load", () => {
            const hash = window.location.hash;
            if (hash === "#contact") {
                const contactForm = document.getElementById("contact");
                if (contactForm) {
                    const yOffset = -100; // Adjust based on nav height
                    const y = contactForm.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            }
        });
    }

    const footer = document.createElement("footer");

    footer.innerHTML = `
    <footer>
        <ul>
            <li>Spoken languages: English, Romanian, Russian</li>
            <li><a href="#">carpeliucstefan@gmail.com</a></li>
        </ul>
        <ul>
            <li><a href="https://www.instagram.com/orange_thoughtss/" target="_blank">
                <img class="btn orangeImgAnim" src="Images/instaIcon.png" alt="Instagram">
            </a></li>
            <li><a href="https://www.linkedin.com/in/stefan-carpeliuc-b2880427b/" target="_blank">
                <img class="btn orangeImgAnim" src="Images/LinkedInIcon.png" alt="LinkedIn">
            </a></li>
            <li><a href="https://x.com/Birkator" target="_blank">
                <img class="btn orangeImgAnim" src="Images/TwitterIcon.png" alt="Twitter">
            </a></li>
            <li><a href="https://github.com/birkaQtrilka" target="_blank">
                <img class="btn orangeImgAnim" src="Images/gitHubIcon.png" alt="GitHub">
            </a></li>
            <li><a href="https://www.youtube.com/channel/UCuIZf3WkVrkOhyHA0Tin4gg" target="_blank">
                <img class="btn orangeImgAnim" src="Images/icons8-youtube-100.png" alt="YouTube">
            </a></li>
        </ul>
    </footer>
    `;

    getBodyWrapper().append(footer);
    
});

