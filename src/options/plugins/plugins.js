console.log("plugin-script.js loaded");

window.addEventListener("load", () => {
    injectPlugins();
});

// Get plugins from plugins.json
function injectPlugins() {
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
        let options = document.querySelector(".plugins-container");
        let plugins = Object.entries(data);
        console.log(settingsData);
        for (let i = 0; i < plugins.length; i++) {
            let plugin = plugins[i];
            let option = document.createElement("div");
            option.classList.add("option");
            // Check if plugin is installed (chrome storage)
            if (settingsData.settings.enabledPlugins.includes(plugin[0])) {
                option.innerHTML = `
                    <h3 class="text-text">${plugin[1].name}</h3>
                    <div class="text-subtext0">${plugin[1].description}</div>
                    <button class="small uninstall-plugin bg-green" plugin-name="${plugin[0]}">Enabled</button>
                `;
                // add listener for button
                let uninstallButton = option.querySelector(".uninstall-plugin");
                uninstallButton.addEventListener("click", () => {
                    uninstallPlugin(uninstallButton);
                });
            } else {
                option.innerHTML = `
                    <h3 class="text-text">${plugin[1].name}</h3>
                    <div class="text-subtext0">${plugin[1].description}</div>
                    <button class="small install-plugin bg-red" plugin-name="${plugin[0]}">Disabled</button>
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
