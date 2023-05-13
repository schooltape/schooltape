console.log("settings-script.js loaded");

// listener for when the page is loaded
window.addEventListener("load", () => {
    console.log("page loaded");
    loadGlobalToggle();
    globalToggleListener();
    loadUpdateNotifs();
    updateNotifsListener();
    loadThemeToggle();
    themeToggleListener();

    // 200ms delay to allow for the transitions to finish
    setTimeout(() => {
        document.body.classList.add("load");
    }, 200);
});

// load global toggle function
function loadGlobalToggle() {
    chrome.storage.local.get(["settings"], function (result) {
        console.log("settings is currently ", result.settings);
        if (result.settings.global) {
            document.getElementById("global-toggle").checked = true;
        } else {
            document.getElementById("global-toggle").checked = false;
        }
    });
}
// global toggle listener
function globalToggleListener() {
    document.getElementById("global-toggle").addEventListener("change", function () {
        chrome.storage.local.get(['settings'], function(result) {
            if (result.settings.global === true) {
                let newSettings = result.settings;
                newSettings.global = false;
                chrome.storage.local.set({"settings": newSettings}, function() {});
                chrome.runtime.sendMessage({ badgeText: true });
        
            } else if (result.settings.global === false) {
                let newSettings = result.settings;
                newSettings.global = true;
                chrome.storage.local.set({"settings": newSettings}, function() {});
                chrome.runtime.sendMessage({ badgeText: true });
            }
        });
    });
}

// load update notifications function
function loadUpdateNotifs() {
    chrome.storage.local.get(["settings"], function (result) {
        console.log("settings is currently ", result.settings);
        if (result.settings.updateReminder) {
            document.getElementById("update-notifs").checked = true;
        } else {
            document.getElementById("update-notifs").checked = false;
        }
    });
}
// update notifications listener
function updateNotifsListener() {
    document.getElementById("update-notifs").addEventListener("change", function () {
        chrome.storage.local.get(['settings'], function(result) {
            if (result.settings.updateReminder === true) {
                let newSettings = result.settings;
                newSettings.updateReminder = false;
                chrome.storage.local.set({"settings": newSettings}, function() {});        
            } else if (result.settings.updateReminder === false) {
                let newSettings = result.settings;
                newSettings.updateReminder = true;
                chrome.storage.local.set({"settings": newSettings}, function() {});
            }
        });
    });
}

// load theme function
function loadThemeToggle() {
    chrome.storage.local.get(["settings"], function (result) {
        console.log("settings is currently ", result.settings);
        if (result.settings.themes) {
            document.getElementById("theme-toggle").checked = true;
        } else {
            document.getElementById("theme-toggle").checked = false;
        }
    });
}
// theme toggle listener
function themeToggleListener() {
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
}