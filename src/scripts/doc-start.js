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
            console.log("themes.js loaded");

            let sections = [];
            chrome.storage.local.get(["settings"], function (data) {
                if (data.settings.themes) {
                    let theme = data.settings.currentTheme;
                    // eg theme = "catppuccin-macchiato-pink"
                    // now we have to split this into three sections, separated by the -'s
                    sections = theme.split('-');
                    // sections will be an array containing ["catppuccin", "macchiato", "pink"]
                    // console.log(sections);
                    if (sections[0] == "catppuccin") {
                        injectCatppuccin(sections[1], sections[2]);
                        injectCSS(`/themes/catppuccin.css`);
                    }
                }
            });

            function injectCatppuccin(flavor, accent) {
                console.log("injecting catppuccin theme");
                fetch(chrome.runtime.getURL("/themes/catppuccin.json"))
                    .then(console.log("fetching catppuccin theme"))
                    .then(response => response.json())
                    .then(palette => injectStyles(palette, flavor, accent))
            }

            function injectStyles(palette, flavor, accent) {
                let style = document.createElement('style');
                let cssText = '';
                for (let color in palette[flavor]["colors"]) {
                    let c = palette[flavor]["colors"][color]
                    let hsl = `${c.hsl.h} ${c.hsl.s*100}% ${c.hsl.l*100}%`;
                    cssText += `:root { --ctp-${color}: ${hsl}; }\n`;
                }
                let a = palette[flavor]["colors"][accent].hsl;
                cssText += `:root { --ctp-accent: ${`${a.h} ${a.s*100}% ${a.l*100}%`}; }\n`;
                style.textContent = cssText;
                document.head.appendChild(style);
            }
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