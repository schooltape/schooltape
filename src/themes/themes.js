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
            for (let color in palette[flavor]["colors"]) {
                let c = palette[flavor]["colors"][color]
                document.querySelector(':root').style.setProperty(`--ctp-${color}`, `${c.hsl.h} ${c.hsl.s*100}% ${c.hsl.l*100}%`);
                if (color === accent) {
                    document.querySelector(':root').style.setProperty("--ctp-accent", `${c.hsl.h} ${c.hsl.s*100}% ${c.hsl.l*100}%`);
                }
            }
        });
}