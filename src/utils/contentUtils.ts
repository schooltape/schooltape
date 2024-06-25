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

export function injectLogo(logo: LogoDetails) {
  logger.info(`[content-utils] Injecting Logo: ${logo.name}`);
  if (logo.disable) {
    return;
  }
  let style = document.createElement("style");
  style.classList.add("schooltape");
  style.textContent = `a.logo > img { content: url("${logo.url}"); max-width: 30%; }`;
  document.head.appendChild(style);
}

export function injectStylesheet(url: any) {
  logger.info(`[content-utils] Injecting stylesheet: ${url}`);
  let link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = browser.runtime.getURL(url);
  link.classList.add("schooltape");
  document.head.appendChild(link);
}

export async function injectSnippets() {
  logger.info("[content-utils] Injecting snippets");
  // inbuilt snippets
  const snippets = await snippetSettings.getValue();
  snippets.snippetOrder.forEach((snippetID) => {
    let snippet = snippets.snippets[snippetID];
    if (snippet.toggle) {
      injectStylesheet(`/snippets/${snippetID}.css`);
    }
  });
  // user snippets
  for (let snippetID in snippets.user) {
    let userSnippet = snippets.user[snippetID];
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
}
