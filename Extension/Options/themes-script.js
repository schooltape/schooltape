console.log("theme-script.js loaded");

// listener for when the page is loaded
window.addEventListener("load", () => {
    console.log("page loaded");
    document.body.classList.add("load");
});

chrome.storage.local.get(["settings"], function (result) {
    if (result.settings.themes) {
        injectThemes();
    } else {
        document.querySelector(".themes-container").innerHTML = `
            <div class="option">
                <div class="option__name">Themes are disabled</div>
                <div class="option__description">Press the button on the right to enable themes, to disable them go to the settings page</div>
                <div class="option__button">
                    <button class="accent">Enable</button>
                </div>
            </div>
        `;
        document.querySelector(".themes-container button").addEventListener("click", () => {
            chrome.storage.local.get(['settings'], function(settingsData) { // get settings
                let newSettings = settingsData.settings;
                newSettings.themes = true;
                chrome.storage.local.set({"settings": newSettings}, function() {
                    console.log("Themes enabled");
                    // Reload page
                    location.reload();
                }
            )});
        });
    }
});

// Get themes from themes.json
function injectThemes() {
    console.log("getThemes() called");
    fetch("/Themes/themes.json")
        .then(response => response.json())
        .then(data => {
            console.log(data);
            addThemes(data);
        }
    );
}
// Add themes to the page
function addThemes(data) {
    chrome.storage.local.get(['settings'], function(settingsData) { // get settings
        console.log("addThemes() called");
        let options = document.querySelector(".themes-container");
        let themes = Object.entries(data);
        for (let i = 0; i < themes.length; i++) {
            let theme = themes[i];
            let option = document.createElement("div");
            option.classList.add("option");
            // Check if theme is installed (chrome storage)
            console.log(settingsData);
            if (settingsData.settings.currentTheme == theme[0]) {
                option.innerHTML = `
                    <div class="option__name">${theme[1].name}</div>
                    <div class="option__description">${theme[1].description}</div>
                    <div class="option__button">
                        <button disabled class="accent" theme-name="${theme[0]}">Selected</button>
                    </div>
                `;
            } else {
                option.innerHTML = `
                    <div class="option__name">${theme[1].name}</div>
                    <div class="option__description">${theme[1].description}</div>
                    <div class="option__button">
                        <button class="lightweight install-theme" theme-name="${theme[0]}">Select</button>
                    </div>
                `;
                
                // add listener for button
                let installButton = option.querySelector(".install-theme");
                installButton.addEventListener("click", () => {
                    installTheme(installButton);
                });
            }
            options.appendChild(option);
        }
    });
}
function installTheme(button) {
    console.log("installTheme() called");
    // Change theme
    let themeName = button.getAttribute("theme-name");
    console.log(themeName);
    chrome.storage.local.get(['settings'], function(settingsData) { // get settings
        settingsData.settings.currentTheme = themeName;
        chrome.storage.local.set({settings: settingsData.settings}, function() {
            console.log("Theme changed to " + themeName);
            // Reload page
            location.reload();
        }
    )});
}