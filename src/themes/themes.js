let sections = [];
chrome.storage.local.get(["settings"], function (data) {
    if (data.settings.themes) {
        let theme = data.settings.currentTheme;
        // eg theme = "catppuccin-macchiato-pink"
        // now we have to split this into three sections, separated by the -'s
        sections = theme.split('-');
        // sections will be an array containing ["catppuccin", "macchiato", "pink"]
        // console.log(sections);
        if (sections[0] == "catppuccin") {
            injectCatppuccin(sections[1], sections[2]);
            injectCSS(`/themes/catppuccin.css`);
        }
    }
});


function injectCatppuccin(flavor, accent) {
    fetch(chrome.runtime.getURL("/themes/catppuccin.json"))
        .then(response => response.json())
        .then(palette => {
            let style = document.createElement('style');
            let cssText = '';
            for (let color in palette[flavor]["colors"]) {
                let c = palette[flavor]["colors"][color]
                let hsl = `${c.hsl.h} ${c.hsl.s*100}% ${c.hsl.l*100}%`;
                cssText += `:root { --ctp-${color}: ${hsl}; }\n`;
            }
            let a = palette[flavor]["colors"][accent].hsl;
            cssText += `:root { --ctp-accent: ${`${a.h} ${a.s*100}% ${a.l*100}%`}; }\n`;
            style.textContent = cssText;
            document.head.appendChild(style);
        });
}