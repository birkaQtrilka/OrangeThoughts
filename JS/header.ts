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
                    <a href="https://www.linkedin.com/in/stefan-carpeliuc-b2880427b/" target="_blank">
                        <img class="btn orangeImgAnim" src="Images/LinkedInIcon.png" alt="LinkedIn">
                    </a>
                </li>
                <li>
                    <a href="https://github.com/birkaQtrilka" target="_blank">
                        <img class="btn orangeImgAnim" src="Images/gitHubIcon.png" alt="GitHub">
                    </a>
                </li>
            </ul>
        </nav>
    `;

    getBodyWrapper().prepend(header);

    const footer = document.createElement("footer");

    footer.innerHTML = `
    <footer>
        <ul>
            <li>Spoken languages: English, Romanian, Russian</li>
            <li><a href="#">birkavidit@gmail.com</a></li>
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

