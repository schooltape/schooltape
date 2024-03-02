// This is for:
// - Plugins (that alter the DOM after is has been loaded)

// inject enabled plugins if the current URL is stored as Schoolbox and extension is enabled
chrome.storage.local.get(["settings"], function (data) {
    if (data.settings.global) {
        if (data.settings.urls.includes(window.location.origin)) {
            for (let i = 0; i < data.settings.enabledPlugins.length; i++) {
                injectPlugin(data.settings.enabledPlugins[i]);
            }
        }
    }
});

// check if the page is Schoolbox, if not add it to storage and reload the page
schoolboxChecker();

// ----------------- Functions ----------------- //
function injectPlugin(pluginName) {
    // inject plugins
    let xhr = new XMLHttpRequest();
    xhr.open("GET", chrome.runtime.getURL("/plugins/plugins.json"), true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            let resp = JSON.parse(xhr.responseText);
            let scripts = resp[pluginName].scripts;
            // for each script, inject it
            for (let i = 0; i < scripts.length; i++) {
                if (scripts[i].execute == "doc-end") {
                    injectJS(scripts[i].path);
                }
            }
        }
    }
    xhr.send();
}

function injectJS(js) {
    chrome.runtime.sendMessage({inject: js}, function() {
    });
    // console.log(`%c[doc-end.js]`, docEndConsole, "Requested to inject " + js);
}

function schoolboxChecker() {
    // check if the page is schoolbox
    try {
        let footer = getChildNode(document.getElementById("footer"), 1);
        if (footer.innerHTML.includes("Schoolbox")) {
            let footerListItem = document.createElement("LI");
            footerListItem.innerHTML = "<a href='https://schooltape-community.github.io'>Schooltape</a> "+chrome.runtime.getManifest().version;
            footer.appendChild(footerListItem);
            // check if the current url is saved in the storage
            chrome.storage.local.get("settings", function (data) {
                // if the url is not saved
                if (!data.settings.urls.includes(window.location.origin)) {
                    let settings = data.settings;
                    settings.urls.push(window.location.origin);
                    chrome.storage.local.set({"settings": settings}, function () {
                        // console.log(`%c[doc-end.js]`, docEndConsole, "Added URL to storage");
                    });
                    // reload page
                    window.location.reload();
                }
            });
            return true;
        } else {
            return false;
        }
    }
    catch (e) {
        return false;
    }
}

function getChildNode(node, childNum, nodeName = null) {
    let childCounter = 0;
    for (let i = 0; i < node.childNodes.length; i++) {
        // If node type is an element node
        if (node.childNodes[i].nodeType === 1) {
            if (nodeName) {
                if (node.childNodes[i].nodeName === nodeName) {
                    childCounter++;
                }
            } else {
                childCounter++;
            }
            if (childCounter === childNum) {
                return node.childNodes[i];
            }
        }
    }
}
