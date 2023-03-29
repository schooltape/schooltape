const stickyNavConsole = "color: brown; font-weight: bold;";
console.log(`%c[sticky-nav.js]`, stickyNavConsole, "Injected sticky-nav.js!");

// create sticky spacer element and append to .main after #hybrid-bar
const stickySpacer = document.createElement("div");
stickySpacer.id = "sticky-spacer";
stickySpacer.classList.add("schooltape");
stickySpacer.style.height = "100%";
// stickySpacer.style.display = "none";
document.querySelector(".main").insertBefore(stickySpacer, document.querySelector("#hybrid-bar").nextSibling);



injectCSS();

function injectCSS() {
    const link = document.createElement("link");
    link.href = chrome.runtime.getURL("/Plugins/sticky-nav/sticky-nav.css");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.className = "schooltape-css";
    document.head.appendChild(link);
    console.log(`%c[sticky-nav.js]`, stickyNavConsole, "Injected sticky-nav.css");
  }