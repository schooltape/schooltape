/*
For developers:
Please read the Contributing guidelines here --> https://github.com/schooltape/schooltape/blob/main/CONTRIBUTING.md
*/

console.log("Service worker active!");

// ----------------- Variables ----------------- //
const defaultSettings = {
  "global": true,
  "updateReminder": true,
  "themes": false,
  "currentTheme": "light-modern",
  "enabledPlugins": [
      "subheader",
      "modern-icons",
      "hide-pfp",
      "legacy-timetable"
  ],
  "urls": ["https://help.schoolbox.com.au"]
}

// ----------------- Set Badge Text ----------------- //
chrome.tabs.onActivated.addListener(function() {
  chrome.storage.local.get(['settings'], function(data) { 
      if (data.settings.global) {
          chrome.action.setBadgeText({text:'ON'});
      } else {
          chrome.action.setBadgeText({text:'OFF'});
      }
  });
});

// ----------------- Install/Update ----------------- //

// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function(details){
  if(details.reason === "install") {
    // Execute code when first installed
    chrome.notifications.create("tutorial", {
      type: 'basic',
      iconUrl: 'logo.png',
      title: "Thank you for installing Schooltape!",
      message: 'Click here to look at the tutorial.',
      priority: 2
    });
    // set default settings
    chrome.storage.local.set({"settings": defaultSettings}, function() {
      console.log('Set default settings');
    });
    chrome.tabs.create({url: "https://schooltape-community.github.io/installed"}); // Open tutorial page

  } else if(details.reason === "update") {
    // set default settings
    chrome.storage.local.set({"settings": defaultSettings}, function() {
      console.log('Set default settings');
    });
    // set "gloabl" to true without overwriting existing settings
    chrome.storage.local.get("settings", function(result) {
      var settings = result.settings;
      settings.global = true;
      chrome.storage.local.set({"settings": settings}, function() {
        console.log('Set global to true');
      });
    });
    // Sends a notification to the user with the changelog
    var thisVersion = chrome.runtime.getManifest().version;
    console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
    chrome.notifications.create("updated", {
      type: 'basic',
      iconUrl: 'logo.png',
      title: "Updated from " + details.previousVersion + " to " + thisVersion + "!",
      message: 'Click here to look at the release notes.',
      priority: 2
    });
  }
});

// ----------------- Listeners ----------------- //
chrome.runtime.onMessage.addListener (
  function(request, sender, sendResponse) {
    console.log("Message received: ")
    console.log(request);

    // CHANGE ICON
    if (request.icon) {
      chrome.action.setIcon({
        path: request.icon,
        tabId: sender.tab.id
      })
      return true;
    }
    // INJECT JS
    if (request.inject) {
      console.log("Injecting " + request.inject)
      chrome.scripting.executeScript({
        target: { tabId: sender.tab.id },
        files: [request.inject]
      })
      return true;
    }
    // Check for updates
    if (!navigator.onLine) { // check if online
      console.error("You are currently offline. Please check your internet connection and try again.");
    } else {
      if (request.checkForUpdates) {
        // Get latest and pre-release information from github
        fetch('https://api.github.com/repos/schooltape-community/schooltape/releases/latest')
        .then(response => response.json())
        .then(data => {
          // Get latest version without the "v" in front
          var latestVersion = data.tag_name.replace("v", "");
          console.log("Latest version is " + latestVersion);

          // Get current version
          var currentVersion = chrome.runtime.getManifest().version;
          console.log("Current version is " + currentVersion);

          // Compare versions
          if (latestVersion > currentVersion) {
            console.log("Update available");
            // Send notification
            chrome.notifications.create("update", {
              type: 'basic',
              iconUrl: 'logo.png',
              title: "Update available!",
              message: `New version: ${latestVersion}\n(Currently installed: ${currentVersion})\nClick here to look at the release notes.`,
              priority: 2
            });
          } else {
            console.log("No update available");
          }
        })
        .catch((error) => {
          console.error("Error occurred while fetching latest release", error);
        });
      }
    }
  }
);

// ----------------- Context Menus ----------------- //