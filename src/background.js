/*
For developers:
Please read the Contributing guidelines here --> https://github.com/schooltape/schooltape/blob/main/CONTRIBUTING.md
*/

console.log("Service worker active!");

// ----------------- Variables ----------------- //
const defaultSettings = {
  global: true,
  updateReminder: true,
  themes: false,
  currentTheme: "catppuccin-macchiato-rosewater",
  enabledPlugins: ["subheader", "scroll-segments", "tab-title", "scroll-period", "timetable-labels"],
  enabledSnippets: ["hide-pfp"],
  userSnippets: [],
  urls: ["https://help.schoolbox.com.au"],
};

// ----------------- Update Badge Text () ----------------- //
chrome.tabs.onActivated.addListener(function () {
  updateBadge();
});

// ----------------- Install/Update ----------------- //

// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason === "install") {
    // Execute code when first installed
    chrome.notifications.create("tutorial", {
      type: "basic",
      iconUrl: "logo.png",
      title: "Thank you for installing Schooltape!",
      message: "Click here to look at the tutorial.",
      priority: 2,
    });
    // set default settings
    chrome.storage.local.set({ settings: defaultSettings }, function () {
      console.log("Set default settings");
    });
  } else if (details.reason === "update") {
    let thisVersion = chrome.runtime.getManifest().version;

    // // set default settings, if major number is increased
    // if (details.previousVersion.split(".")[0] > thisVersion.split(".")[0]) {
    //   resetSettings();
    //   print("New major version installed, reset settings")
    // }

    // set "global" to true without overwriting existing settings
    chrome.storage.local.get("settings", function (result) {
      let settings = result.settings;

      // iterate over every key in defaultSettings, if it doesn't exist in settings, add it, and vice versa remove it if it doesn't exist in defaultSettings
      // add setting if it doesn't exist in settings
      for (const [key, value] of Object.entries(defaultSettings)) {
        if (!settings.hasOwnProperty(key)) {
          console.log(`Adding ${key}`);
          settings[key] = value;
        }
      }
      // remove setting if it doesn't exist in defaultSettings
      for (const [key, value] of Object.entries(settings)) {
        if (!defaultSettings.hasOwnProperty(key)) {
          console.log(`Deleting ${key}`);
          delete settings[key];
        }
      }
      settings.global = true;

      console.log(settings);

      chrome.storage.local.set({ settings: settings }, function () {
        console.log("Updated settings. Set global to true.");
        chrome.browserAction.setBadgeText({ text: "ON" });
        chrome.browserAction.setBadgeBackgroundColor({ color: "#94DBF9" });
        chrome.browserAction.setBadgeTextColor({ color: "black" });
      });
    });
    // Sends a notification to the user with the changelog
    console.log(`Updated from ${details.previousVersion} to ${thisVersion}!`);
    chrome.notifications.create("updated", {
      type: "basic",
      iconUrl: "logo.png",
      title: `Updated from ${details.previousVersion} to ${thisVersion}!`,
      message: "Click here to look at the release notes.",
      priority: 2,
    });
  }
});

// ----------------- Listeners ----------------- //
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("Message received: ");
  console.log(request);

  sendResponse({ messageReceived: true });

  // CHANGE ICON
  if (request.icon) {
    chrome.browserAction.setIcon({
      path: request.icon,
      tabId: sender.tab.id,
    });
  }
  // UPDATE BADGE TEXT
  if (request.badgeText) {
    updateBadge();
    console.log("Running update badge text function");
  }
  // INJECT JS
  if (request.inject) {
    console.log("Injecting " + request.inject);
    console.log(`tabid: ${sender.tab.id}`);
    chrome.tabs.executeScript(sender.tab.id, { file: request.inject });
  }
  // Switch to homepage
  if (request.toHomepage) {
    console.log("Changing tab to " + request.toHomepage);
    chrome.tabs.query({ url: request.toHomepage }, function (tabs) {
      console.log(tabs);
      if (tabs.length > 0) {
        chrome.tabs.update(tabs[0].id, { active: true });
      } else {
        chrome.tabs.update(sender.tab.id, { url: request.toHomepage });
      }
    });
  }

  if (request.resetSettings) {
    console.log("Resetting settings...");
    resetSettings();
  }

  // Check for updates
  if (!navigator.onLine) {
    // check if online
    console.error("You are currently offline. Please check your internet connection and try again.");
  } else {
    chrome.storage.local.get("settings", function (result) {
      if (request.checkForUpdates && result.settings.updateReminder) {
        // Get latest and pre-release information from github
        fetch("https://api.github.com/repos/42willow/schooltape/releases/latest")
          .then((response) => response.json())
          .then((data) => {
            // Get latest version without the "v" in front
            let latestVersion = data.tag_name.replace("v", "");
            console.log("Latest version is " + latestVersion);

            // Get current version
            let currentVersion = chrome.runtime.getManifest().version;
            console.log("Current version is " + currentVersion);

            // Compare versions
            if (latestVersion > currentVersion) {
              console.log("Update available");
              // Send notification
              chrome.notifications.create("update", {
                type: "basic",
                iconUrl: "logo.png",
                title: "Update available!",
                message: `New version: ${latestVersion}\n(Currently installed: ${currentVersion})\nClick here to look at the release notes.`,
                priority: 2,
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
});

/*
--------------------------------CONTEXT MENUS--------------------------------
*/
// Context menus
console.log("created context menu");
chrome.contextMenus.removeAll(function () {
  // Github
  let github = chrome.contextMenus.create({
    id: "github",
    title: "GitHub",
    contexts: ["browser_action"],
  });
  chrome.contextMenus.create({
    id: "githubRepo",
    parentId: github,
    title: "Repository",
    contexts: ["browser_action"],
  });
  chrome.contextMenus.create({
    id: "githubIssues",
    parentId: github,
    title: "Issues",
    contexts: ["browser_action"],
  });
  chrome.contextMenus.create({
    id: "githubPRs",
    parentId: github,
    title: "Pull Requests",
    contexts: ["browser_action"],
  });
  chrome.contextMenus.create({
    id: "githubProjects",
    parentId: github,
    title: "Projects",
    contexts: ["browser_action"],
  });
  chrome.contextMenus.create({
    id: "githubWiki",
    parentId: github,
    title: "Wiki",
    contexts: ["browser_action"],
  });

  chrome.contextMenus.create({
    id: "extRefresh",
    title: "Refresh Extension",
    contexts: ["browser_action"],
  });
  chrome.contextMenus.create({
    id: "extOptions",
    title: "Schooltape Settings",
    contexts: ["browser_action"],
  });
});

// Check which context menu button was clicked
function contextClick(info, tab) {
  const { menuItemId } = info;
  if (menuItemId === "githubRepo") {
    let newURL = "https://github.com/42willow/schooltape";
    chrome.tabs.create({ url: newURL });
  } else if (menuItemId === "githubIssues") {
    let newURL = "https://github.com/42willow/schooltape/issues";
    chrome.tabs.create({ url: newURL });
  } else if (menuItemId === "githubPRs") {
    let newURL = "https://github.com/42willow/schooltape/pulls";
    chrome.tabs.create({ url: newURL });
  } else if (menuItemId === "githubProjects") {
    let newURL = "https://github.com/42willow/schooltape/projects";
    chrome.tabs.create({ url: newURL });
  } else if (menuItemId === "githubWiki") {
    let newURL = "https://github.com/42willow/schooltape/wiki";
    chrome.tabs.create({ url: newURL });
  } else if (menuItemId === "extRefresh") {
    console.log("Refreshing extension...");
    chrome.runtime.reload();
  } else if (menuItemId === "extOptions") {
    chrome.runtime.openOptionsPage();
  }
}
chrome.contextMenus.onClicked.addListener(contextClick);

/*
// --------------------------------UPDATE NOTIFICATION CLICKED LISTERNER--------------------------------
// */
chrome.notifications.onClicked.addListener(function (notifID) {
  if (notifID === "update") {
    chrome.tabs.create({
      url: "https://github.com/42willow/schooltape/releases/latest",
    });
  }
  if (notifID === "tutorial") {
    chrome.tabs.create({
      url: "https://github.com/42Willow/schooltape/wiki/Getting-Started#configuring",
    });
  }
  if (notifID === "updated") {
    let thisVersion = chrome.runtime.getManifest().version;
    let newURL = "https://github.com/42willow/schooltape/releases/tag/v" + thisVersion;
    chrome.tabs.create({ url: newURL });
  }
});

// /*
// --------------------------------EXTENSION BUTTON CLICKED--------------------------------
// */
// On extension clicked
chrome.browserAction.onClicked.addListener((tab) => {
  console.log("Button clicked!");

  // TOGGLE EXTENSION
  chrome.storage.local.get(["settings"], function (result) {
    if (result.settings.global === true) {
      let newSettings = result.settings;
      newSettings.global = false;
      chrome.storage.local.set({ settings: newSettings }, function () {});
      chrome.browserAction.setBadgeText({ text: "OFF" });
      // Reload current tab
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.reload(tabs[0].id);
      });
    } else if (result.settings.global === false) {
      let newSettings = result.settings;
      newSettings.global = true;
      chrome.storage.local.set({ settings: newSettings }, function () {});
      chrome.browserAction.setBadgeText({ text: "ON" });
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.reload(tabs[0].id);
      });
    }
    chrome.browserAction.setBadgeBackgroundColor({ color: "#94DBF9" });
    chrome.browserAction.setBadgeTextColor({ color: "black" });
  });
});

// /*
// --------------------------------UPDATE BADGE--------------------------------
// */
function updateBadge() {
  console.log("Updating badge...");
  chrome.storage.local.get(["settings"], function (data) {
    console.log(data);
    if (data.settings.global) {
      chrome.browserAction.setBadgeText({ text: "ON" });
    } else {
      chrome.browserAction.setBadgeText({ text: "OFF" });
    }
    chrome.browserAction.setBadgeBackgroundColor({ color: "#94DBF9" });
    chrome.browserAction.setBadgeTextColor({ color: "black" });
  });
}

function resetSettings() {
  chrome.storage.local.set({ settings: defaultSettings }, function () {
    console.log("Reset settings");
  });
}
