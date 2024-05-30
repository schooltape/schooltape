import browser from "webextension-polyfill";

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
browser.tabs.onActivated.addListener(function () {
  updateBadge();
});

// ----------------- Install/Update ----------------- //

// Check whether new version is installed
browser.runtime.onInstalled.addListener(function (details) {
  if (details.reason === "install") {
    // Execute code when first installed
    browser.notifications.create("tutorial", {
      type: "basic",
      iconUrl: "assets/icon-128.png",
      title: "Thank you for installing Schooltape!",
      message: "Click here to look at the tutorial.",
      priority: 2,
    });
    // set default settings
    browser.storage.local.set({ settings: defaultSettings }, function () {
      console.log("Set default settings");
    });
  } else if (details.reason === "update") {
    let thisVersion = browser.runtime.getManifest().version;

    // // set default settings, if major number is increased
    // if (details.previousVersion.split(".")[0] > thisVersion.split(".")[0]) {
    //   resetSettings();
    //   print("New major version installed, reset settings")
    // }

    // set "global" to true without overwriting existing settings
    browser.storage.local.get("settings", function (result) {
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

      browser.storage.local.set({ settings: settings }, function () {
        console.log("Updated settings. Set global to true.");
        browser.action.setBadgeText({ text: "ON" });
        browser.action.setBadgeBackgroundColor({ color: "#94DBF9" });
        browser.action.setBadgeTextColor({ color: "black" });
      });
    });
    // Sends a notification to the user with the changelog
    console.log(`Updated from ${details.previousVersion} to ${thisVersion}!`);
    browser.notifications.create("updated", {
      type: "basic",
      iconUrl: "assets/icon-128.png",
      title: `Updated from ${details.previousVersion} to ${thisVersion}!`,
      message: "Click here to look at the release notes.",
      priority: 2,
    });
  }
});

// ----------------- Listeners ----------------- //
browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("Message received: ");
  console.log(request);

  sendResponse({ messageReceived: true });

  // CHANGE ICON
  if (request.icon) {
    browser.action.setIcon({
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
    // NOTE: see https://github.com/mozilla/webextension-polyfill?tab=readme-ov-file#tabsexecutescript
    browser.tabs.executeScript(sender.tab.id, { file: request.inject });
  }
  // Switch to homepage
  if (request.toHomepage) {
    console.log("Changing tab to " + request.toHomepage);
    browser.tabs.query({ url: request.toHomepage }, function (tabs) {
      console.log(tabs);
      if (tabs.length > 0) {
        browser.tabs.update(tabs[0].id, { active: true });
      } else {
        browser.tabs.update(sender.tab.id, { url: request.toHomepage });
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
    browser.storage.local.get("settings", function (result) {
      if (request.checkForUpdates && result.settings.updateReminder) {
        // Get latest and pre-release information from github
        fetch("https://api.github.com/repos/42willow/schooltape/releases/latest")
          .then((response) => response.json())
          .then((data) => {
            // Get latest version without the "v" in front
            let latestVersion = data.tag_name.replace("v", "");
            console.log("Latest version is " + latestVersion);

            // Get current version
            let currentVersion = browser.runtime.getManifest().version;
            console.log("Current version is " + currentVersion);

            // Compare versions
            if (latestVersion > currentVersion) {
              console.log("Update available");
              // Send notification
              browser.notifications.create("update", {
                type: "basic",
                iconUrl: "assets/icon-128.png",
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
browser.contextMenus.removeAll(function () {
  // Github
  let github = browser.contextMenus.create({
    id: "github",
    title: "GitHub",
    contexts: ["action"],
  });
  browser.contextMenus.create({
    id: "githubRepo",
    parentId: github,
    title: "Repository",
    contexts: ["action"],
  });
  browser.contextMenus.create({
    id: "githubIssues",
    parentId: github,
    title: "Issues",
    contexts: ["action"],
  });
  browser.contextMenus.create({
    id: "githubPRs",
    parentId: github,
    title: "Pull Requests",
    contexts: ["action"],
  });
  browser.contextMenus.create({
    id: "githubProjects",
    parentId: github,
    title: "Projects",
    contexts: ["action"],
  });
  browser.contextMenus.create({
    id: "githubWiki",
    parentId: github,
    title: "Wiki",
    contexts: ["action"],
  });

  browser.contextMenus.create({
    id: "extRefresh",
    title: "Refresh Extension",
    contexts: ["action"],
  });
});

// Check which context menu button was clicked
function contextClick(info, tab) {
  const { menuItemId } = info;
  if (menuItemId === "githubRepo") {
    let newURL = "https://github.com/42willow/schooltape";
    browser.tabs.create({ url: newURL });
  } else if (menuItemId === "githubIssues") {
    let newURL = "https://github.com/42willow/schooltape/issues";
    browser.tabs.create({ url: newURL });
  } else if (menuItemId === "githubPRs") {
    let newURL = "https://github.com/42willow/schooltape/pulls";
    browser.tabs.create({ url: newURL });
  } else if (menuItemId === "githubProjects") {
    let newURL = "https://github.com/42willow/schooltape/projects";
    browser.tabs.create({ url: newURL });
  } else if (menuItemId === "githubWiki") {
    let newURL = "https://github.com/42willow/schooltape/wiki";
    browser.tabs.create({ url: newURL });
  } else if (menuItemId === "extRefresh") {
    console.log("Refreshing extension...");
    browser.runtime.reload();
  }
}
browser.contextMenus.onClicked.addListener(contextClick);

/*
// --------------------------------UPDATE NOTIFICATION CLICKED LISTERNER--------------------------------
// */
browser.notifications.onClicked.addListener(function (notifID) {
  if (notifID === "update") {
    browser.tabs.create({
      url: "https://github.com/42willow/schooltape/releases/latest",
    });
  }
  if (notifID === "tutorial") {
    browser.tabs.create({
      url: "https://github.com/42Willow/schooltape/wiki/Getting-Started#configuring",
    });
  }
  if (notifID === "updated") {
    let thisVersion = browser.runtime.getManifest().version;
    let newURL = "https://github.com/42willow/schooltape/releases/tag/v" + thisVersion;
    browser.tabs.create({ url: newURL });
  }
});

// /*
// --------------------------------EXTENSION BUTTON CLICKED--------------------------------
// */
// On extension clicked
browser.action.onClicked.addListener((tab) => {
  console.log("Button clicked!");

  // TOGGLE EXTENSION
  browser.storage.local.get(["settings"], function (result) {
    if (result.settings.global === true) {
      let newSettings = result.settings;
      newSettings.global = false;
      browser.storage.local.set({ settings: newSettings }, function () {});
      browser.action.setBadgeText({ text: "OFF" });
      // Reload current tab
      browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        browser.tabs.reload(tabs[0].id);
      });
    } else if (result.settings.global === false) {
      let newSettings = result.settings;
      newSettings.global = true;
      browser.storage.local.set({ settings: newSettings }, function () {});
      browser.action.setBadgeText({ text: "ON" });
      browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        browser.tabs.reload(tabs[0].id);
      });
    }
    browser.action.setBadgeBackgroundColor({ color: "#94DBF9" });
    browser.action.setBadgeTextColor({ color: "black" });
  });
});

// /*
// --------------------------------UPDATE BADGE--------------------------------
// */
function updateBadge() {
  console.log("Updating badge...");
  browser.storage.local.get(["settings"], function (data) {
    console.log(data);
    if (data.settings.global) {
      browser.action.setBadgeText({ text: "ON" });
    } else {
      browser.action.setBadgeText({ text: "OFF" });
    }
    browser.action.setBadgeBackgroundColor({ color: "#94DBF9" });
    browser.action.setBadgeTextColor({ color: "black" });
  });
}

function resetSettings() {
  browser.storage.local.set({ settings: defaultSettings }, function () {
    console.log("Reset settings");
  });
}
