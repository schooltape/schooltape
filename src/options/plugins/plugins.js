

// inject plugins
fetch("/plugins/plugins.json")
    .then(response => response.json())
    .then(data => {
        console.log(data);
        addPlugins(data);
    }
);

// Add plugins to the page
function addPlugins(data) {
    chrome.storage.local.get(['settings'], function(settingsData) {
        let options = document.querySelector(".plugins-container");
        let plugins = Object.entries(data);
        console.log(settingsData);
        plugins.forEach((plugin) => {
            let pluginId = plugin[0];
            let pluginName = plugin[1].name;
            let pluginDescription = plugin[1].description;
            let pluginToggled = false;
            // console.log(pluginId);
            // console.log(settingsData.settings.enabledPlugins);
            if (settingsData.settings.enabledPlugins.includes(pluginId)) {
                pluginToggled = true;
            }
            let option = document.createElement("div");
            option.classList.add("my-4");
            option.classList.add("group");
            option.innerHTML = `
                <label class="relative flex justify-between items-center group py-2 text-xl text-text">
                    <h4 class="text-text">${pluginName}</h4>
                    <input plugin-id="${pluginId}" ${pluginToggled ? 'checked' : ''} type="checkbox" class="plugin-toggle absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md" />
                    <span class="w-11 h-5 flex items-center flex-shrink-0 ml-4 p-1 bg-red rounded-lg duration-500 ease-in-out peer-checked:bg-green after:w-3 after:h-3 after:bg-base after:rounded-lg after:shadow-md after:duration-300 peer-checked:after:translate-x-6 group-hover:after:translate-x-1"></span>
                </label>
                <div class="text-subtext0 group-hover:text-subtext1">${pluginDescription}</div>
            `;
            options.appendChild(option);
        });

        // toggle listeners
        const pluginToggles = document.querySelectorAll(".plugin-toggle");

        pluginToggles.forEach((toggle) => {
            // console.log(toggle);
            toggle.addEventListener("click", toggleClicked);
        });
    });
}

function toggleClicked(event) {
    // console.log(event.target);
    let pluginId = event.target.getAttribute("plugin-id");
    if (event.target.checked) {
        installPlugin(pluginId);
    } else {
        uninstallPlugin(pluginId);
    }
}

function installPlugin(pluginId) {
    chrome.storage.local.get(['settings'], function(settingsData) {
        let settings = settingsData.settings;
        settings.enabledPlugins.push(pluginId);
        chrome.storage.local.set({"settings": settings}, function() {
            console.log(`Installed plugin ${pluginId}`);
        });
    });
}
function uninstallPlugin(pluginId) {
    chrome.storage.local.get(['settings'], function(settingsData) { 
        let settings = settingsData.settings;
        settings.enabledPlugins.splice(settings.enabledPlugins.indexOf(pluginId), 1);
        chrome.storage.local.set({"settings": settings}, function() {
            console.log(`Uninstalled plugin ${pluginId}`);
        });
    });
}
