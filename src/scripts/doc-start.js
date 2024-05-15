// This is for:
// - Plugins (That inject stylesheets)
// - Themes
// - Snippets

chrome.runtime.sendMessage({checkForUpdates: true}, function() {});

// check if the current url is saved in the storage and extension is enabled
chrome.storage.local.get(["settings"], function (data) {
    if (data.settings.global) {
        if (data.settings.urls.includes(window.location.origin)) {
            for (let i = 0; i < data.settings.enabledPlugins.length; i++) {
                injectPlugin(data.settings.enabledPlugins[i]);
            }
            injectJS(`/themes/themes.js`);
            injectSnippets();
        }
    }
});

// ----------------- Functions ----------------- //
function injectSnippets() {
    fetch(chrome.runtime.getURL("/snippets/snippets.json"))
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            chrome.storage.local.get(['settings'], function(settingsData) {
                let snippets = Object.entries(data);
                // Inject snippets
                snippets.forEach((snippet) => {
                    // console.log(snippet);
                    let snippetID = snippet[0];
                    let snippetPath = snippet[1].path;
                    let snippetToggled = settingsData.settings.enabledSnippets.includes(snippetID);
                    if (snippetToggled) {
                        injectCSS(`/snippets/${snippetPath}`);
                    }
                });
                
                // Inject user snippets
                let userSnippets = settingsData.settings.userSnippets;
                userSnippets.forEach((snippet) => {
                    // console.log("Injecting user snippet:");
                    // console.log(snippet);
                    let snippetID = Object.keys(snippet)[0];
                    let snippetAuthor = Object.values(snippet)[0].author;
                    let snippetURL = `https://gist.githubusercontent.com/${snippetAuthor}/${snippetID}/raw`
                    // console.log(snippetID);
                    // console.log(snippetURL);
                    let snippetToggled = settingsData.settings.enabledSnippets.includes(snippetID);
                    if (snippetToggled) {
                        if (snippetToggled) {
                            fetch(snippetURL)
                                .then(response => response.text())
                                .then(css => {
                                    let style = document.createElement("style");
                                    style.textContent = css;
                                    document.head.appendChild(style);
                                });
                        }
                    }
                });
            });
        }
    );
}

function injectPlugin(pluginName) {
    // inject plugins
    let xhr = new XMLHttpRequest();
    xhr.open("GET", chrome.runtime.getURL("/plugins/plugins.json"), true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            let resp = JSON.parse(xhr.responseText);
            // console.log("pluginName", pluginName);
            // console.log(resp);
            // console.log(resp[pluginName]);
            try {
                let scripts = resp[pluginName].scripts;
                for (let i = 0; i < scripts.length; i++) {
                    if (scripts[i].execute == "doc-start") {
                        injectJS(scripts[i].path);
                        // console.log(`Injected Plugin ${i+1}/${scripts.length} (${scripts[i].path})`);
                    }
                }
            } catch { // Enabled plugin not found in plugins.json, remove it from the enabled plugins list
                chrome.storage.local.get(["settings"], function (data) {
                    let newSettings = data.settings;
                    newSettings.enabledPlugins.splice(newSettings.enabledPlugins.indexOf(pluginName), 1);
                    chrome.storage.local.set({settings: newSettings}, function() {
                        console.log(`Removed ${pluginName} from enabled plugins list`);
                    });
                });
            }
        }
    }
    xhr.send();
}

function injectCSS(css) {
    // console.log(`Injecting CSS: ${css}`);
    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = chrome.runtime.getURL(css);
    document.head.appendChild(link);
}

function injectJS(js) {
    chrome.runtime.sendMessage({inject: js}, function() {
    });
}