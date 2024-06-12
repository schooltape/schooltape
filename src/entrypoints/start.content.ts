export default defineContentScript({
  matches: ["<all_urls>"],
  runAt: "document_start",
  cssInjectionMode: 'manual',
  async main() {
    let settings = await globalSettings.getValue();
    let themes = await themeSettings.getValue();
    if (settings.global && settings.urls.includes(window.location.origin)) {
      logger.info("[start.content.ts] Schooltape is enabled on this site");
      if (themes.toggle) {
        logger.info(themes);
        injectCSS("/assets/catppuccin.css");
        injectCatppuccin(themes.flavour, themes.accent);
      }
    }
  }
});

// // // This is for:
// // // - Plugins (That inject stylesheets)
// // // - Themes
// // // - Snippets

// // browser.runtime.sendMessage({ checkForUpdates: true }, function () {});

// // // check if the current url is saved in the storage and extension is enabled
// // browser.storage.local.get(["settings"], function (data) {
// //   if (data.settings.global && data.settings.urls.includes(window.location.origin)) {
// //     for (let i = 0; i < data.settings.enabledPlugins.length; i++) {
// //       runUtilsFunction("injectPlugin", data.settings.enabledPlugins[i], "doc-start");
// //     }

// //     if (data.settings.themes) {
// //       let theme = data.settings.currentTheme;
// //       // eg theme = "catppuccin-macchiato-pink"
// //       // now we have to split this into three sections, separated by the -'s
// //       let sections = theme.split("-");
// //       // sections will be an array containing ["catppuccin", "macchiato", "pink"]
// //       // console.log(sections);
// //       if (sections[0] == "catppuccin") {
// //         injectCatppuccin(sections[1], sections[2]);
// //         runUtilsFunction("injectCSS", "/themes/catppuccin.css");
// //       }
// //     }
// //     function injectCatppuccin(flavour, accent) {
// //       // console.log("injecting catppuccin theme");
// //       fetch(browser.runtime.getURL("/themes/catppuccin.json"))
// //         .then((response) => response.json())
// //         .then((palette) => injectStyles(palette, flavour, accent));
// //     }
// //     function injectStyles(palette, flavour, accent) {
// //       let style = document.createElement("style");
// //       style.classList.add("schooltape");
// //       let cssText = "";
// //       for (let color in palette[flavour]["colors"]) {
// //         let c = palette[flavour]["colors"][color];
// //         let hsl = `${c.hsl.h} ${c.hsl.s * 100}% ${c.hsl.l * 100}%`;
// //         cssText += `:root { --ctp-${color}: ${hsl}; }\n`;
// //       }
// //       let a = palette[flavour]["colors"][accent].hsl;
// //       cssText += `:root { --ctp-accent: ${`${a.h} ${a.s * 100}% ${a.l * 100}%`}; }\n`;
// //       style.textContent = cssText;
// //       document.head.appendChild(style);
// //     }
// //     injectSnippets();
// //   }
// // });

// // // ----------------- Functions ----------------- //
// // function injectSnippets() {
// //   fetch(browser.runtime.getURL("/snippets/snippets.json"))
// //     .then((response) => response.json())
// //     .then((data) => {
// //       // console.log(data);
// //       browser.storage.local.get(["settings"], function (settingsData) {
// //         let snippets = Object.entries(data);
// //         // Inject inbuilt snippets
// //         snippets.forEach((snippet) => {
// //           let snippetID = snippet[0];
// //           let snippetPath = snippet[1].path;
// //           let snippetToggled = settingsData.settings.enabledSnippets.includes(snippetID);
// //           if (snippetToggled) {
// //             runUtilsFunction("injectCSS", `/snippets/${snippetPath}`);
// //           }
// //         });

// //         // Inject user snippets
// //         let userSnippets = settingsData.settings.userSnippets;
// //         userSnippets.forEach((snippet) => {
// //           let snippetID = Object.keys(snippet)[0];
// //           let snippetAuthor = Object.values(snippet)[0].author;
// //           let snippetURL = `https://gist.githubusercontent.com/${snippetAuthor}/${snippetID}/raw`;
// //           let snippetToggled = settingsData.settings.enabledSnippets.includes(snippetID);
// //           if (snippetToggled) {
// //             if (snippetToggled) {
// //               fetch(snippetURL)
// //                 .then((response) => response.text())
// //                 .then((css) => {
// //                   let style = document.createElement("style");
// //                   style.textContent = css;
// //                   style.classList.add("schooltape");
// //                   document.head.appendChild(style);
// //                 });
// //             }
// //           }
// //         });
// //       });
// //     });
// // }

// // async function runUtilsFunction(functionName, ...args) {
// //   const src = browser.runtime.getURL("scripts/scriptUtils.js");
// //   const utils = await import(src);
// //   if (typeof utils[functionName] === "function") {
// //     utils[functionName](...args);
// //   } else {
// //     console.error(`Function ${functionName} does not exist in utils`);
// //   }
// // }
