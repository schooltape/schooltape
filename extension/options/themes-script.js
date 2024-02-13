console.log("theme-script.js loaded");

const flavours = ["latte", "frappe", "macchiato", "mocha"];
const accents = ["rosewater", "flamingo", "pink", "mauve", "red", "maroon", "peach", "yellow", "green", "teal", "sky", "sapphire", "blue", "lavender"];

window.addEventListener("load", () => {
    console.log("page loaded");
    document.body.classList.add("load");
});

chrome.storage.local.get(["settings"], function (result) {
    if (result.settings.themes) {
        populateDropdowns();
        console.log(result.settings.currentTheme);
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
                    location.reload();
                }
            )});
        });
    }
});

function updateSettings() {
    const flavourDropdown = document.getElementById("flavour-dropdown");
    const accentDropdown = document.getElementById("accent-dropdown");

    let selectedFlavour = flavourDropdown.value;
    let selectedAccent = accentDropdown.value;

    let themeID = `catppuccin-${selectedFlavour}-${selectedAccent}`

    chrome.storage.local.get(['settings'], function(settingsData) {
        settingsData.settings.currentTheme = themeID;
        chrome.storage.local.set({settings: settingsData.settings}, function() {
            console.log("Theme changed to " + themeID);
            // Reload page
            location.reload();
        }
    )});
}

function populateDropdowns() {
    const flavourDropdown = document.getElementById("flavour-dropdown");
    const accentDropdown = document.getElementById("accent-dropdown");

    // Populate flavour dropdown
    for (const flavour of flavours) {
        let flavourOption = document.createElement("option");
        flavourOption.value = flavour;
        flavourOption.textContent = flavour;
        flavourDropdown.appendChild(flavourOption);
    }

    // Populate accent dropdown
    for (const accent of accents) {
        let accentOption = document.createElement("option");
        accentOption.value = accent;
        accentOption.textContent = accent;
        accentDropdown.appendChild(accentOption);
    }

    // Set appropriate values of dropdowns
    chrome.storage.local.get(['settings'], function(settingsData) {
        let theme = settingsData.settings.currentTheme;
        // eg theme = "catppuccin-macchiato-pink"
        // now we have to split this into three sections, separated by the -'s
        let sections = theme.split('-');
        // sections will be an array containing ["catppuccin", "macchiato", "pink"]
        flavourDropdown.value = sections[1];
        accentDropdown.value = sections[2];
    });

    // Add event listeners to dropdowns
    flavourDropdown.addEventListener("change", updateSettings);
    accentDropdown.addEventListener("change", updateSettings);
};


// function injectThemes() {
//     chrome.storage.local.get(['settings'], function(settingsData) { // get settings
//         console.log("injectThemes() called");
//         let options = document.querySelector(".themes-container");
        
//         for (const flavour of flavours) {
//             for (const accent of accents) {
//                 let option = document.createElement("div");
//                 option.classList.add("option");
//                 console.log(settingsData);
//                 let themeID = `catppuccin-${flavour}-${accent}`
//                 let themeName = `Catppuccin ${flavour} ${accent}`
//                 if (settingsData.settings.currentTheme === themeID) {
//                     option.innerHTML = `
//                         <div class="option__name">${themeName}</div>
//                         <div class="option__button">
//                             <button disabled class="accent" theme-name="${themeID}">Selected</button>
//                         </div>
//                     `;
//                 } else {
//                     option.innerHTML = `
//                         <div class="option__name">${themeName}</div>
//                         <div class="option__button">
//                             <button class="lightweight install-theme" theme-name="${themeID}">Select</button>
//                         </div>
//                     `;
//                     let installButton = option.querySelector(".install-theme");
//                     installButton.addEventListener("click", () => {
//                         installTheme(installButton);
//                     });
//                 }
//                 options.appendChild(option);
//             }
//         }
//     });
// }

// function setTheme(themeID) {
//     console.log("setTheme() called");
//     // Change theme
//     console.log(themeID);
//     chrome.storage.local.get(['settings'], function(settingsData) { // get settings
//         settingsData.settings.currentTheme = themeID;
//         chrome.storage.local.set({settings: settingsData.settings}, function() {
//             console.log("Theme changed to " + themeID);
//             // Reload page
//             location.reload();
//         }
//     )});
// }