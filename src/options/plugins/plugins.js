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
    chrome.storage.local.get(['settings'], function(settingsData) { // get settings
        let options = document.querySelector(".plugins-container");
        let plugins = Object.entries(data);
        console.log(settingsData);
        for (let i = 0; i < plugins.length; i++) {
            let plugin = plugins[i];
            let option = document.createElement("div");
            option.classList.add("my-4");
            option.classList.add("group");
            // Check if plugin is installed (chrome storage)
            // if (settingsData.settings.enabledPlugins.includes(plugin[0])) {
            //     option.innerHTML = `
            //         <label class="relative flex justify-between items-center group p-2 text-xl text-text">
            //             <h2 class="from-blue to-teal">Themes</h2>
            //             <input id="theme-toggle" type="checkbox" class="absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md" />
            //             <span class="w-14 h-8 flex items-center flex-shrink-0 ml-4 p-1 bg-red rounded-lg duration-500 ease-in-out peer-checked:bg-green after:w-6 after:h-6 after:bg-base after:rounded-lg after:shadow-md after:duration-300 peer-checked:after:translate-x-6 group-hover:after:translate-x-1"></span>
            //         </label>
            //         <div class="text-subtext0">${plugin[1].description}</div>
            //         <button class="small uninstall-plugin bg-green" plugin-name="${plugin[0]}">Enabled</button>
            //     `;
            //     // add listener for button
            //     let uninstallButton = option.querySelector(".uninstall-plugin");
            //     uninstallButton.addEventListener("click", () => {
            //         uninstallPlugin(uninstallButton);
            //     });
            // } else {
            //     option.innerHTML = `
            //         <h3 class="text-text mt-4">${plugin[1].name}</h3>
            //         <div class="text-subtext0">${plugin[1].description}</div>
            //         <button class="small install-plugin bg-red" plugin-name="${plugin[0]}">Disabled</button>
            //     `;
            //     // add listener for button
            //     let installButton = option.querySelector(".install-plugin");
            //     installButton.addEventListener("click", () => {
            //         installPlugin(installButton);
            //     });
            // }
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
