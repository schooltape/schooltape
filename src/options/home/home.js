// toggle button
chrome.storage.local.get(["settings"], function (result) {
    console.log("settings is currently ", result.settings);
    let btn = document.getElementById("toggle");
    if (result.settings.global) {
        // is enabled
        btn.classList = "bg-green hover:bg-pink active:bg-red/75";
        btn.innerHTML = "enabled";
    } else {
        // is disabled
        btn.classList = "bg-red hover:bg-pink active:bg-green/75";
        btn.innerHTML = "disabled";
    }
});


document.getElementById("toggle").addEventListener("click", function () {
    chrome.storage.local.get(['settings'], function(result) {
        let btn = document.getElementById("toggle");
        if (result.settings.global) {
            // toggle to false
            let newSettings = result.settings;
            newSettings.global = false;
            chrome.storage.local.set({"settings": newSettings}, function() {});
            chrome.runtime.sendMessage({ badgeText: true });
            btn.classList = "bg-red hover:bg-pink active:bg-green/75";
            btn.innerHTML = "disabled";
    
        } else {
            // toggle to true
            let newSettings = result.settings;
            newSettings.global = true;
            chrome.storage.local.set({"settings": newSettings}, function() {});
            chrome.runtime.sendMessage({ badgeText: true });
            btn.classList = "bg-green hover:bg-pink active:bg-red/75";
            btn.innerHTML = "enabled";
        }
    });
});


// update notifications

chrome.storage.local.get(["settings"], function (result) {
    console.log("settings is currently ", result.settings);
    if (result.settings.updateReminder) {
        document.getElementById("update-notifs").checked = true;
    } else {
        document.getElementById("update-notifs").checked = false;
    }
});
// update notifications listener
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
