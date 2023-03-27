const hidePfpConsole = "color: red; font-weight: bold;";
console.log(`%c[hide-pfp-start.js]`, hidePfpConsole, "Injecting CSS...");

var css = document.createElement("link");
css.rel = "stylesheet";
css.href = chrome.runtime.getURL("/Plugins/hide-pfp/hide-pfp.css");
css.classList.add("profile-picture", "schooltape");
document.head.appendChild(css);