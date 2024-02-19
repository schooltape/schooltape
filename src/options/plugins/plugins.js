injectPlugins();

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
    chrome.storage.local.get(['settings'], function(settingsData) {
        let options = document.querySelector(".plugins-container");
        let plugins = Object.entries(data);
        console.log(settingsData);
        for (let i = 0; i < plugins.length; i++) {
            let plugin = plugins[i];
            let option = document.createElement("div");
            option.classList.add("my-4");
            option.classList.add("group");
            option.innerHTML = `
                <label class="relative flex justify-between items-center group py-2 text-xl text-text">
                    <h4 class="text-text">${plugin[1].name}</h4>
                    <input plugin-id="${plugin[0]} id="theme-toggle" type="checkbox" class="absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md" />
                    <span class="w-11 h-5 flex items-center flex-shrink-0 ml-4 p-1 bg-red rounded-lg duration-500 ease-in-out peer-checked:bg-green after:w-3 after:h-3 after:bg-base after:rounded-lg after:shadow-md after:duration-300 peer-checked:after:translate-x-6 group-hover:after:translate-x-1"></span>
                </label>
                <div class="text-subtext0 group-hover:text-subtext1">${plugin[1].description}</div>
            `;
            options.appendChild(option);
        }
    });
}
function installPlugin(button) {
    let pluginName = button.getAttribute("plugin-name");
    chrome.storage.local.get(['settings'], function(settingsData) {
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
    chrome.storage.local.get(['settings'], function(settingsData) { 
        let settings = settingsData.settings;
        settings.enabledPlugins.splice(settings.enabledPlugins.indexOf(pluginName), 1);
        chrome.storage.local.set({"settings": settings}, function() {
            console.log(`Uninstalled plugin ${pluginName}`);
        });
    });
    window.location.reload();
}
