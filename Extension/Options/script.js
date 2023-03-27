console.log("script.js loaded");

// listener for when the page is loaded
window.addEventListener("load", () => {
    console.log("page loaded");
    document.body.classList.add("load");
});