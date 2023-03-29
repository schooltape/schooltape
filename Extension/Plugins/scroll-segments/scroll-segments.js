const scrollSegmentsConsole = "color: brown; font-weight: bold;";
console.log(`%cscroll-segments.js]`, scrollSegmentsConsole, "Injected scroll-segments.js!");


// append a new div with the class "row" to the element with the id "content"
let content = document.getElementById("content");
let row = document.createElement("div");
row.classList.add("row");
content.appendChild(row);
// add schooltape class to the row
row.classList.add("schooltape");

// set display to none of #footer
let footer = document.getElementById("footer");
footer.style.display = "none";

// append a clone of footer to the row
let footerClone = footer.cloneNode(true);
footerClone.style.display = "block";
footerClone.style.marginBottom = "50px";
row.appendChild(footerClone);



injectCSS();

function injectCSS() {
    const link = document.createElement("link");
    link.href = chrome.runtime.getURL("/Plugins/scroll-segments/scroll-segments.css");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.className = "schooltape-css";
    document.head.appendChild(link);
    console.log(`%c[scroll-segments.js]`, scrollSegmentsConsole, "Injected scroll-segments.css");
  }