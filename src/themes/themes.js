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


function injectCatppuccin(req_flavor, req_accent) {
    // console.log("match!");
    // get info from catppuccin.json
    fetch(chrome.runtime.getURL("/themes/catppuccin.json"))
        .then(response => response.json())
        .then(palette => {
            // console.log(palette);
            for (let flavor in palette) {
                // console.log(palette[flavor]);
                // if flavor is in sections, inject the css vars
                if (flavor == req_flavor) {
                    // console.log("flavor match!"+flavor);
                    for (let color in palette[flavor]["colors"]) {
                        let c = palette[flavor]["colors"][color]
                        // console.log(color);
                        // console.log(c);
                        document.querySelector(':root').style.setProperty(`--ctp-${color}`, `${c.hsl.h} ${c.hsl.s*100}% ${c.hsl.l*100}%`);
                        if (color === req_accent) {
                            document.querySelector(':root').style.setProperty("--ctp-accent", `${c.hsl.h} ${c.hsl.s*100}% ${c.hsl.l*100}%`);
                        }
                    }
                }
            };
        }
    );
    
}