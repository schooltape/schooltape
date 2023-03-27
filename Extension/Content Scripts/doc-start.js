const docStartConsole = "color: orange; font-weight: bold;";
console.log(`%c[doc-start.js]`, docStartConsole, "Injected doc-start.js!");


chrome.runtime.sendMessage({checkForUpdates: true}, function() {
    console.log(`%c[doc-start.js]`, docStartConsole, "Checking for updates...");
});

// check if the current url is saved in the storage and extension is enabled
chrome.storage.local.get(["settings"], function (data) {
    if (data.settings.global) {
        if (data.settings.urls.includes(window.location.origin)) {
            console.log(`%c[doc-start.js]`, docStartConsole, "Schoolbox detected, running Schooltape");
            // Inject all enabled plugins
            for (let i = 0; i < data.settings.enabledPlugins.length; i++) {
                injectPlugin(data.settings.enabledPlugins[i]);
            }
        } else {
            console.log(`%c[doc-start.js]`, docStartConsole, "Schoolbox not detected");
        }
    } else {
        console.log(`%c[doc-start.js]`, docStartConsole, "Extension disabled");
    }
});

// ----------------- Functions ----------------- //
function injectPlugin(pluginName) {
    // inject plugins
    let xhr = new XMLHttpRequest();
    xhr.open("GET", chrome.runtime.getURL("/Plugins/plugins.json"), true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            let resp = JSON.parse(xhr.responseText);
            let scripts = resp[pluginName].scripts;
            // for each script, inject it
            for (let i = 0; i < scripts.length; i++) {
                if (scripts[i].execute == "doc-start") {
                    injectJS(scripts[i].path);
                    console.log(`%c[doc-start.js]`, docStartConsole, `Injected ${scripts[i].path}`);
                }
            }
        }
    }
    xhr.send();
}

function injectJS(js) {
    chrome.runtime.sendMessage({inject: js}, function() {
    });
    // console.log(`%c[doc-start.js]`, docStartConsole, "Requested to inject " + js);
}