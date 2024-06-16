export function injectCSS(css: any) {
  logger.info(`[content-utils] Injecting CSS: ${css}`);
  let link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = browser.runtime.getURL(css);
  link.classList.add("schooltape");
  document.head.appendChild(link);
}

export function injectCatppuccin(flavour: string, accent: string) {
  logger.info(`[content-utils] Injecting Catppuccin: ${flavour} ${accent}`);
  fetch(browser.runtime.getURL("/catppuccin.json"))
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
    });
}

export function injectPlugin(pluginName: string, injectionScript: string) {
  // inject plugins
  let xhr = new XMLHttpRequest();
  xhr.open("GET", browser.runtime.getURL("/plugins.json"), true);
  xhr.onreadystatechange = async function () {
    if (xhr.readyState == 4) {
      let resp = JSON.parse(xhr.responseText);
      try {
        let scripts = resp[pluginName].scripts;
        for (let i = 0; i < scripts.length; i++) {
          if (scripts[i].execute == injectionScript) {
            // it's time to inject!
            browser.runtime.sendMessage({ inject: scripts[i].path });
          }
        }
      } catch (error) {
        // Enabled plugin not found in plugins.json, remove it from the enabled plugins list
        logger.warn(`[content-utils] Plugin ${pluginName} not found in plugins.json, disabling`);
        let plugins = await pluginSettings.getValue();
        plugins.enabled.splice(plugins.enabled.indexOf(pluginName), 1);
        await pluginSettings.setValue(plugins);
      }
    }
  };
  xhr.send();
}

export function injectSnippets() {
  fetch(browser.runtime.getURL("/snippets.json"))
    .then((response) => response.json())
    .then(async (data) => {
      const snippetsSettings = await snippetSettings.getValue();
      const snippets = Object.entries(data);
      // Inject inbuilt snippets
      snippets.forEach((snippet) => {
        let snippetID = snippet[0];
        if (typeof snippet[1] === "object" && snippet[1] !== null && "path" in snippet[1]) {
          let snippetPath = snippet[1].path;
          let snippetToggled = snippetsSettings.enabled.includes(snippetID);
          if (snippetToggled) {
            injectCSS(`assets/${snippetPath}`);
          }
        }
      });

      // Inject user snippets
      let userSnippets = (await snippetSettings.getValue()).user;
      for (let snippetID in userSnippets) {
        let userSnippet = userSnippets[snippetID];
        if (userSnippet.toggle) {
          fetch(`https://gist.githubusercontent.com/${userSnippet.author}/${snippetID}/raw`)
            .then((response) => response.text())
            .then((css) => {
              let style = document.createElement("style");
              style.textContent = css;
              style.classList.add("schooltape");
              document.head.appendChild(style);
            });
        }
      }
    });
}
