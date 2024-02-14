console.log("plugin-script.js loaded");

// listener for when the page is loaded
window.addEventListener("load", () => {
    console.log("page loaded");
    document.body.classList.add("load");
});

injectPlugins();
// Get plugins from plugins.json
function injectPlugins() {
    console.log("getPlugins() called");
    fetch("/plugins/plugins.json")
        .then(response => response.json())
        .then(data => {
            console.log(data);
            addPlugins(data);
        }
    );
}

// Add plugins to the page
function addPlugins(data) {
    chrome.storage.local.get(['settings'], function(settingsData) { // get settings
        console.log("addOptions() called");
        let options = document.querySelector(".plugins-container");
        let plugins = Object.entries(data);
        for (let i = 0; i < plugins.length; i++) {
            let plugin = plugins[i];
            let option = document.createElement("div");
            option.classList.add("option");
            // Check if plugin is installed (chrome storage)
            console.log(settingsData);
            if (settingsData.settings.enabledPlugins.includes(plugin[0])) {
                option.innerHTML = `
                    <div class="option__name">${plugin[1].name}</div>
                    <div class="option__description">${plugin[1].description}</div>
                    <div class="option__button">
                        <button class="accent uninstall-plugin" plugin-name="${plugin[0]}">Disable</button>
                    </div>
                `;
                // add listener for button
                let uninstallButton = option.querySelector(".uninstall-plugin");
                uninstallButton.addEventListener("click", () => {
                    uninstallPlugin(uninstallButton);
                });
            } else {
                option.innerHTML = `
                    <div class="option__name">${plugin[1].name}</div>
                    <div class="option__description">${plugin[1].description}</div>
                    <div class="option__button">
                        <button class="lightweight install-plugin" plugin-name="${plugin[0]}">Enable</button>
                    </div>
                `;
                // add listener for button
                let installButton = option.querySelector(".install-plugin");
                installButton.addEventListener("click", () => {
                    installPlugin(installButton);
                });
            }
            options.appendChild(option);
        }
    });
}
function installPlugin(button) {
    console.log("installPlugin() called");
    let pluginName = button.getAttribute("plugin-name");
    chrome.storage.local.get(['settings'], function(settingsData) { // get settings
        let settings = settingsData.settings;
        settings.enabledPlugins.push(pluginName);
        chrome.storage.local.set({"settings": settings}, function() {
            console.log(`Installed plugin ${pluginName}`);
        });
    });
    window.location.reload();
}
function uninstallPlugin(button) {
    console.log("uninstallPlugin() called");
    let pluginName = button.getAttribute("plugin-name");
    chrome.storage.local.get(['settings'], function(settingsData) { // get settings
        let settings = settingsData.settings;
        settings.enabledPlugins.splice(settings.enabledPlugins.indexOf(pluginName), 1);
        chrome.storage.local.set({"settings": settings}, function() {
            console.log(`Uninstalled plugin ${pluginName}`);
        });
    });
    window.location.reload();
}


