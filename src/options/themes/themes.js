const flavours = ["latte", "frappe", "macchiato", "mocha"];
const accents = ["rosewater", "flamingo", "pink", "mauve", "red", "maroon", "peach", "yellow", "green", "teal", "sky", "sapphire", "blue", "lavender"];

accentHighlight();
accentListener();

flavourHighlight();
flavourListener();

// load theme toggle
chrome.storage.local.get(["settings"], function (result) {
    console.log(result.settings);
    if (result.settings.themes) {
        document.getElementById("theme-toggle").checked = true;
    } else {
        document.getElementById("theme-toggle").checked = false;
    }
});

// theme toggle listener
document.getElementById("theme-toggle").addEventListener("change", function () {
    chrome.storage.local.get(['settings'], function(result) {
        if (result.settings.themes === true) {
            let newSettings = result.settings;
            newSettings.themes = false;
            chrome.storage.local.set({"settings": newSettings}, function() {});
        } else if (result.settings.themes === false) {
            let newSettings = result.settings;
            newSettings.themes = true;
            chrome.storage.local.set({"settings": newSettings}, function() {});
        }
    });
});

// populate themes page
chrome.storage.local.get(["settings"], function (result) {
    if (result.settings.themes) {
        // populateDropdowns();
        console.log(result.settings.currentTheme);
    }
});

// functions

// function updateSettings() {
//     const flavourDropdown = document.getElementById("flavour-dropdown");
//     const accentDropdown = document.getElementById("accent-dropdown");

//     let selectedFlavour = flavourDropdown.value;
//     let selectedAccent = accentDropdown.value;

//     let themeID = `catppuccin-${selectedFlavour}-${selectedAccent}`

//     chrome.storage.local.get(['settings'], function(settingsData) {
//         settingsData.settings.currentTheme = themeID;
//         chrome.storage.local.set({settings: settingsData.settings}, function() {
//             console.log("Theme changed to " + themeID);
//             // Reload page
//             location.reload();
//         }
//     )});
// }

// buttons for flavours
function flavourListener() {
    const flavourButtons = document.querySelectorAll("#flavours > button");

    flavourButtons.forEach((btn) => {
        btn.addEventListener("click", flavourClicked);
    });
}

function flavourClicked(event) {
    chrome.storage.local.get(['settings'], function(settingsData) {
        let currentAccent = settingsData.settings.currentTheme.split('-')[2];

        // update accent in settings
        // console.log(event.target);
        // console.log(event.target.innerHTML);
        let selectedFlavour = event.target.innerHTML;
        let themeID = `catppuccin-${selectedFlavour}-${currentAccent}`;
        settingsData.settings.currentTheme = themeID;
        chrome.storage.local.set({settings: settingsData.settings}, function() {
            console.log("theme changed to " + themeID);
        });

        // update styling
        flavourHighlight();
    });

}

function flavourHighlight() {
    const flavourButtons = document.querySelectorAll("#flavours > button");

    chrome.storage.local.get(['settings'], function(settingsData) {
        flavourButtons.forEach((btn) => {
            let currentFlavour = settingsData.settings.currentTheme.split('-')[1];
            // console.log(`currentFlavour = ${currentFlavour}`);
            // console.log(`btn.innerHTML = ${btn.innerHTML}`);
            if (btn.innerHTML === currentFlavour) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });
    });
}


// pallete circles for accents

// listens for if a pallete circle is clicked
function accentListener() {
    const paletteDivs = document.querySelectorAll('#palette > div');

    paletteDivs.forEach((div) => {
        div.addEventListener("click", accentClicked);
        // console.log(div);
    });
}


// triggered when a pallete circle is clicked
function accentClicked(event) {
    chrome.storage.local.get(['settings'], function(settingsData) {
        // remove styling
        let currentFlavour = settingsData.settings.currentTheme.split('-')[1];
        let currentAccent = settingsData.settings.currentTheme.split('-')[2];
        document.querySelector(`#palette > div.bg-${currentAccent}`).classList.remove("current");

        // update accent in settings
        // console.log(event.target);
        // console.log(event.target.classList);
        let selectedAccent = event.target.classList[0].split("-")[1];
        let themeID = `catppuccin-${currentFlavour}-${selectedAccent}`;
        settingsData.settings.currentTheme = themeID;
        chrome.storage.local.set({settings: settingsData.settings}, function() {
            console.log("theme changed to " + themeID);
        });

        // add styling
        document.querySelector(`#palette > div.bg-${selectedAccent}`).classList.add("current");
    });
}

function accentHighlight() {
    chrome.storage.local.get(['settings'], function(settingsData) {
        // eg theme = "catppuccin-macchiato-pink"
        // will be an array containing ["catppuccin", "macchiato", "pink"]
        let currentAccent = settingsData.settings.currentTheme.split('-')[2];
        document.querySelector(`#palette > div.bg-${currentAccent}`).classList.add("current");
    });
}

// function populateDropdowns() {
//     const flavourDropdown = document.getElementById("flavour-dropdown");
//     const accentDropdown = document.getElementById("accent-dropdown");

//     // Populate flavour dropdown
//     for (const flavour of flavours) {
//         let flavourOption = document.createElement("option");
//         flavourOption.value = flavour;
//         flavourOption.textContent = flavour;
//         flavourDropdown.appendChild(flavourOption);
//     }

//     // Populate accent dropdown
//     for (const accent of accents) {
//         let accentOption = document.createElement("option");
//         accentOption.value = accent;
//         accentOption.textContent = accent;
//         accentDropdown.appendChild(accentOption);
//     }

//     // Set appropriate values of dropdowns
//     chrome.storage.local.get(['settings'], function(settingsData) {
//         let theme = settingsData.settings.currentTheme;
//         // eg theme = "catppuccin-macchiato-pink"
//         // now we have to split this into three sections, separated by the -'s
//         let sections = theme.split('-');
//         // sections will be an array containing ["catppuccin", "macchiato", "pink"]
//         flavourDropdown.value = sections[1];
//         accentDropdown.value = sections[2];
//     });

//     // Add event listeners to dropdowns
//     flavourDropdown.addEventListener("change", updateSettings);
//     accentDropdown.addEventListener("change", updateSettings);
// };