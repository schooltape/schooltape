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
      // "modern-icons",
      // "hide-pfp",
      // "legacy-timetable",
      "scroll-segments",
      "tab-title",
      "tab-titles-specific",
  ],
  "urls": ["https://help.schoolbox.com.au"]
}

// ----------------- Update Badge Text () ----------------- //
chrome.tabs.onActivated.addListener(function() {
  updateBadge();
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

  } else if (details.reason === "update") {
    var thisVersion = chrome.runtime.getManifest().version;
    // set default settings, if major number is increased
    if (details.previousVersion.split(".")[0] > thisVersion.split(".")[0]) {
      chrome.storage.local.set({"settings": defaultSettings}, function() {
        console.log("New major version, refreshed settings");
      });
    }

    // set "global" to true without overwriting existing settings
    chrome.storage.local.get("settings", function(result) {
      var settings = result.settings;
      settings.global = true;
      chrome.storage.local.set({"settings": settings}, function() {
        console.log('Set global to true');
      });
    });
    // Sends a notification to the user with the changelog
    console.log(`Updated from ${details.previousVersion} to ${thisVersion}!`);
    chrome.notifications.create("updated", {
      type: 'basic',
      iconUrl: 'logo.png',
      title: `Updated from ${details.previousVersion} to ${thisVersion}!`,
      message: 'Click here to look at the release notes.',
      priority: 2
    });
  }
});

// ----------------- Listeners ----------------- //
chrome.runtime.onMessage.addListener (
  function(request, sender, sendResponse) {
    sendResponse({status: 'ok'});

    console.log("Message received: ")
    console.log(request);

    // CHANGE ICON
    if (request.icon) {
      chrome.action.setIcon({
        path: request.icon,
        tabId: sender.tab.id
      })
    }
    // UPDATE BADGE TEXT
    if (request.badgeText) {
      updateBadge();
      console.log("Running update badge text function");
    }
    // INJECT JS
    if (request.inject) {
      console.log("Injecting " + request.inject)
      chrome.scripting.executeScript({
        target: { tabId: sender.tab.id },
        files: [request.inject]
      })
    }
    // Check for updates
    if (!navigator.onLine) { // check if online
      console.error("You are currently offline. Please check your internet connection and try again.");
    } else {
      chrome.storage.local.get("settings", function(result) {
        if (request.checkForUpdates && result.settings.updateReminder) {
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
      });
    }
  }
);


/*
--------------------------------CONTEXT MENUS--------------------------------
*/
// Context menus
console.log("created context menu")
chrome.contextMenus.removeAll(function() {
  // Github
  let github = chrome.contextMenus.create({
    id: 'github',
    title: 'GitHub',
    contexts: ['action']
  })
  chrome.contextMenus.create({
    id: 'githubRepo',
    parentId: github,
    title: 'Repository',
    contexts: ['action']
  })
  chrome.contextMenus.create({
    id: 'githubIssues',
    parentId: github,
    title: 'Issues',
    contexts: ['action']
  })
  chrome.contextMenus.create({
    id: 'githubPRs',
    parentId: github,
    title: 'Pull Requests',
    contexts: ['action']
  })
  chrome.contextMenus.create({
    id: 'githubDiscussions',
    parentId: github,
    title: 'Discussions',
    contexts: ['action']
  })
  chrome.contextMenus.create({
    id: 'githubProjects',
    parentId: github,
    title: 'Projects',
    contexts: ['action']
  })
  chrome.contextMenus.create({
    id: 'githubWiki',
    parentId: github,
    title: 'Wiki',
    contexts: ['action']
  })
  
  chrome.contextMenus.create({
    id: 'extRefresh',
    title: 'Refresh Extension',
    contexts: ['action']
  })
  chrome.contextMenus.create({
    id: 'extErrors',
    title: 'Schooltape Errors',
    contexts: ['action']
  })
});

// Check which context menu button was clicked
function contextClick(info, tab) {
  const { menuItemId } = info
  if (menuItemId === 'githubRepo') {
    var newURL = "https://github.com/schooltape-community/schooltape";
    chrome.tabs.create({ url: newURL });
  } else if (menuItemId === 'githubIssues') {
    var newURL = "https://github.com/schooltape-community/schooltape/issues";
    chrome.tabs.create({ url: newURL });
  } else if (menuItemId === 'githubPRs') {
    var newURL = "https://github.com/schooltape-community/schooltape/pulls";
    chrome.tabs.create({ url: newURL });
  } else if (menuItemId === 'githubDiscussions') {
    var newURL = "https://github.com/schooltape-community/schooltape/discussions";
    chrome.tabs.create({ url: newURL });
  } else if (menuItemId === 'githubProjects') {
    var newURL = "https://github.com/schooltape-community/schooltape/projects";
    chrome.tabs.create({ url: newURL });
  } else if (menuItemId === 'githubWiki') {
    var newURL = "https://github.com/schooltape-community/schooltape/wiki";
    chrome.tabs.create({ url: newURL });
  } else if (menuItemId === 'extRefresh') {
    console.log("Refreshing extension...");
    chrome.runtime.reload()
  } else if (menuItemId === 'extErrors') {
    var newURL = "chrome://extensions/?errors="+chrome.runtime.id;
    chrome.tabs.create({ url: newURL });
  }
}
chrome.contextMenus.onClicked.addListener(contextClick);

/*
// --------------------------------UPDATE NOTIFICATION CLICKED LISTERNER--------------------------------
// */
chrome.notifications.onClicked.addListener(function(notifID) {
  if (notifID === "update") {
    chrome.tabs.create({url: "https://github.com/schooltape-community/schooltape/releases/latest"});
  }
  if (notifID === "tutorial") {
    chrome.tabs.create({url: "https://github.com/schooltape-community/schooltape/wiki/tutorial"});
  }
  if (notifID === "updated") {
    var thisVersion = chrome.runtime.getManifest().version;
    var newURL = "https://github.com/schooltape-community/schooltape/releases/tag/v"+thisVersion;
    chrome.tabs.create({ url: newURL });
  }
});

// /*
// --------------------------------EXTENSION BUTTON CLICKED--------------------------------
// */
// On extension clicked
chrome.action.onClicked.addListener((tab) => {
    console.log("Button clicked!");

    // TOGGLE EXTENSION
    chrome.storage.local.get(['settings'], function(result) {
      if (result.settings.global === true) {
        let newSettings = result.settings;
        newSettings.global = false;
        chrome.storage.local.set({"settings": newSettings}, function() {
        });
        chrome.action.setBadgeText({text:'OFF'});
        // Reload current tab
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.reload(tabs[0].id);
        });

      } else if (result.settings.global === false) {
        let newSettings = result.settings;
        newSettings.global = true;
        chrome.storage.local.set({"settings": newSettings}, function() {
        });
        chrome.action.setBadgeText({text:'ON'});
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.reload(tabs[0].id);
        });
      }
    });
});

// /*
// --------------------------------UPDATE BADGE--------------------------------
// */
function updateBadge() {
  console.log("Updating badge...");
  chrome.storage.local.get(['settings'], function(data) { 
    console.log(data);
    if (data.settings.global) {
      chrome.action.setBadgeText({text:'ON'});
    } else {
      chrome.action.setBadgeText({text:'OFF'});
    }
  });
}