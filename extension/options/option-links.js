console.log("option-links.js loaded");

injectLinks(["settings","plugins","themes"]);

function injectLinks(linkList) {
    for (let i = 0; i < linkList.length; i++) {
        let link = document.getElementsByClassName(linkList[i])[0];
        link.href = `${browser.runtime.getURL('/')}options/${linkList[i]}.html`
        console.log("Injected link: " + link.href);
    }
}
