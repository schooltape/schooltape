chrome.runtime.sendMessage({checkForUpdates: true}, function() {});

// check if the current url is saved in the storage and extension is enabled
chrome.storage.local.get(["settings"], function (data) {
    if (data.settings.global) {
        if (data.settings.urls.includes(window.location.origin)) {
            // Inject all enabled plugins
            for (let i = 0; i < data.settings.enabledPlugins.length; i++) {
                injectPlugin(data.settings.enabledPlugins[i]);
            }
            injectThemes();
        }
    }
});

// ----------------- Functions ----------------- //
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
function injectThemes() {
    // inject themes
    // get current theme from local storage
    chrome.storage.local.get(["settings"], function (data) {
        if (data.settings.themes) {
            let theme = data.settings.currentTheme;
            // inject the theme
            injectCSS(`/Themes/${theme}.css`);
            // console.log(`%c[doc-start.js]`, docStartConsole, `Injected theme ${theme}`);
        }
    });
}

function injectCSS(css) {
    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = chrome.runtime.getURL(css);
    document.head.appendChild(link);
}
function injectJS(js) {
    chrome.runtime.sendMessage({inject: js}, function() {
    });
}