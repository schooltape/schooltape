import browser from "webextension-polyfill";

export function injectCSS(css) {
  let link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = browser.runtime.getURL(css);
  link.classList.add("schooltape");
  document.head.appendChild(link);
}

export function injectCatppuccin(flavour, accent) {
  console.log("injecting catppuccin theme");
  fetch(browser.runtime.getURL("themes/catppuccin.json"))
    .then((response) => response.json())
    .then((palette) => {
      let style = document.createElement("style");
      style.classList.add("schooltape");
      let cssText = "";
      for (let color in palette[flavour]["colors"]) {
        let c = palette[flavour]["colors"][color];
        let hsl = `${c.hsl.h} ${c.hsl.s * 100}% ${c.hsl.l * 100}%`;
        cssText += `:root { --ctp-${color}: ${hsl}; }\n`;
      }
      let a = palette[flavour]["colors"][accent].hsl;
      cssText += `:root { --ctp-accent: ${`${a.h} ${a.s * 100}% ${a.l * 100}%`}; }\n`;
      style.textContent = cssText;
      document.head.appendChild(style);
      console.log(style);
    });
}

// export function injectPlugin(pluginName, loadTime) {
//   // inject plugins
//   let xhr = new XMLHttpRequest();
//   xhr.open("GET", browser.runtime.getURL("/plugins/plugins.json"), true);
//   xhr.onreadystatechange = function () {
//     if (xhr.readyState == 4) {
//       let resp = JSON.parse(xhr.responseText);
//       // console.log("pluginName", pluginName);
//       // console.log(resp);
//       // console.log(resp[pluginName]);
//       try {
//         let scripts = resp[pluginName].scripts;
//         for (let i = 0; i < scripts.length; i++) {
//           if (scripts[i].execute == loadTime) {
//             browser.runtime.sendMessage({ inject: scripts[i].path });
//             // console.log(`Injected Plugin ${i+1}/${scripts.length} (${scripts[i].path})`);
//           }
//         }
//       } catch (error) {
//         // Enabled plugin not found in plugins.json, remove it from the enabled plugins list
//         // console.error('An error occurred:', error);
//         browser.storage.local.get(["settings"], function (data) {
//           let newSettings = data.settings;
//           newSettings.enabledPlugins.splice(newSettings.enabledPlugins.indexOf(pluginName), 1);
//           browser.storage.local.set({ settings: newSettings }, function () {
//             // console.log(`Removed ${pluginName} from enabled plugins list`);
//           });
//         });
//       }
//     }
//   };
//   xhr.send();
// }
