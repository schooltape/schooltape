export default defineBackground(() => {
  // ----------------- Variables ----------------- //
  const defaultSettings = {
    settings: {
      global: true,
      updates: {
        toast: true,
        desktop: false,
      },
      urls: ["https://help.schoolbox.com.au"],
    },
    snippets: {
      toggle: true,
      enabled: ["hide-pfp"],
      user: {},
    },
    plugins: {
      toggle: true,
      enabled: ["subheader", "scroll-segments", "tab-title", "scroll-period", "timetable-labels"],
      settings: {},
    },
    themes: {
      toggle: true,
      theme: "catppuccin",
      flavour: "macchiato",
      accent: "rosewater",
      logo: "schooltape.png",
    },
  };
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
      resetSettings();
    } else if (details.reason === "update") {
      let thisVersion = browser.runtime.getManifest().version;
      // set default settings, if major number is increased
      if (details.previousVersion.split(".")[0] > thisVersion.split(".")[0]) {
        resetSettings();
        print("New major version installed, reset settings");
      }
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
    updateBadge();
  });

  // ----------------- Listeners ----------------- //
  browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log("Message received: ");
    console.log(request);

    sendResponse({ messageReceived: true });

    if (request.badgeText) {
      updateBadge();
      console.log("Running update badge text function");
    }

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

    // Reset settings
    if (request.resetSettings) {
      console.log("Resetting settings...");
      resetSettings();
    }

    // Check for updates
    if (request.checkForUpdates) {
      checkForUpdates();
    }
  });

  /*
  --------------------------------CONTEXT MENUS--------------------------------
  */
  // Context menus
  // let action = "action";
  // switch (__BROWSER__) {
  //   case "chrome":
  //     action = "browser_action"
  //     break;
  //   case "firefox":
  //     action = "action"
  //     break;
  // }
  // console.log("created context menu");
  // browser.contextMenus.removeAll(function () {
  //   // Github
  //   let github = browser.contextMenus.create({
  //     id: "github",
  //     title: "GitHub",
  //     contexts: [action],
  //   });
  //   browser.contextMenus.create({
  //     id: "githubRepo",
  //     parentId: github,
  //     title: "Repository",
  //     contexts: [action],
  //   });
  //   browser.contextMenus.create({
  //     id: "githubIssues",
  //     parentId: github,
  //     title: "Issues",
  //     contexts: [action],
  //   });
  //   browser.contextMenus.create({
  //     id: "githubPRs",
  //     parentId: github,
  //     title: "Pull Requests",
  //     contexts: [action],
  //   });
  //   browser.contextMenus.create({
  //     id: "githubProjects",
  //     parentId: github,
  //     title: "Projects",
  //     contexts: [action],
  //   });
  //   browser.contextMenus.create({
  //     id: "githubWiki",
  //     parentId: github,
  //     title: "Wiki",
  //     contexts: [action],
  //   });

  //   browser.contextMenus.create({
  //     id: "extRefresh",
  //     title: "Refresh Extension",
  //     contexts: [action],
  //   });
  // });

  // // Check which context menu button was clicked
  // function contextClick(info, tab) {
  //   const { menuItemId } = info;
  //   if (menuItemId === "githubRepo") {
  //     let newURL = "https://github.com/42willow/schooltape";
  //     browser.tabs.create({ url: newURL });
  //   } else if (menuItemId === "githubIssues") {
  //     let newURL = "https://github.com/42willow/schooltape/issues";
  //     browser.tabs.create({ url: newURL });
  //   } else if (menuItemId === "githubPRs") {
  //     let newURL = "https://github.com/42willow/schooltape/pulls";
  //     browser.tabs.create({ url: newURL });
  //   } else if (menuItemId === "githubProjects") {
  //     let newURL = "https://github.com/42willow/schooltape/projects";
  //     browser.tabs.create({ url: newURL });
  //   } else if (menuItemId === "githubWiki") {
  //     let newURL = "https://github.com/42willow/schooltape/wiki";
  //     browser.tabs.create({ url: newURL });
  //   } else if (menuItemId === "extRefresh") {
  //     console.log("Refreshing extension...");
  //     browser.runtime.reload();
  //   }
  // }
  // browser.contextMenus.onClicked.addListener(contextClick);

  // /*
  // // --------------------------------UPDATE NOTIFICATION CLICKED LISTERNER--------------------------------
  // // */
  // browser.notifications.onClicked.addListener(function (notifID) {
  //   if (notifID === "update") {
  //     browser.tabs.create({
  //       url: "https://github.com/42willow/schooltape/releases/latest",
  //     });
  //   }
  //   if (notifID === "tutorial") {
  //     browser.tabs.create({
  //       url: "https://github.com/42Willow/schooltape/wiki/Getting-Started#configuring",
  //     });
  //   }
  //   if (notifID === "updated") {
  //     let thisVersion = browser.runtime.getManifest().version;
  //     let newURL = "https://github.com/42willow/schooltape/releases/tag/v" + thisVersion;
  //     browser.tabs.create({ url: newURL });
  //   }
  // });

  // /*
  // --------------------------------EXTENSION BUTTON CLICKED--------------------------------
  // */
  // On extension clicked
  // browser.action.onClicked.addListener((tab) => {
  //   console.log("Button clicked!");

  //   // TOGGLE EXTENSION
  //   browser.storage.local.get(["settings"], function (result) {
  //     if (result.settings.global === true) {
  //       let newSettings = result.settings;
  //       newSettings.global = false;
  //       browser.storage.local.set({ settings: newSettings }, function () {});
  //       browser.action.setBadgeText({ text: "OFF" });
  //       // Reload current tab
  //       browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  //         browser.tabs.reload(tabs[0].id);
  //       });
  //     } else if (result.settings.global === false) {
  //       let newSettings = result.settings;
  //       newSettings.global = true;
  //       browser.storage.local.set({ settings: newSettings }, function () {});
  //       browser.action.setBadgeText({ text: "ON" });
  //       browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  //         browser.tabs.reload(tabs[0].id);
  //       });
  //     }
  //     browser.action.setBadgeBackgroundColor({ color: "#94DBF9" });
  //     browser.action.setBadgeTextColor({ color: "black" });
  //   });
  // });

  // // /*
  // // --------------------------------UPDATE BADGE--------------------------------
  // // */
  async function updateBadge() {
    console.log("Updating badge...");
    const settings = await browser.storage.local.get("settings");
    console.log(settings);
    // if (settings.global) {
    //   console.log("Badge: ON");
    // } else {
    //   console.log("Badge: OFF");
    // }
  }

  function resetSettings() {
    browser.storage.local.clear();
    browser.storage.local.set({
      settings: defaultSettings.settings,
      snippets: defaultSettings.snippets,
      plugins: defaultSettings.plugins,
      themes: defaultSettings.themes,
    });
    updateBadge();
  }

  function checkForUpdates() {
    if (!navigator.onLine) {
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
  }
});
