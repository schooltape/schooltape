# Schooltape
### About
A browser extension to improve the look and feel of Schoolbox. [Download the latest stable release here!](https://github.com/42willow/schooltape/releases/latest)

### Supported Browsers
- [Firefox](#firefox) | [Download](https://www.mozilla.org/en-US/firefox/ "Download Firefox") (Mac/Win/Linux)
- [Google Chrome](#chrome) | [Download](https://www.google.com.au/chrome/ "Download Google Chrome") (Mac/Win/Linux)
- [Microsoft Edge](#edge) | [Download](https://www.microsoft.com/en-us/edge "Download Microsoft Edge") (Mac/Win/Linux)
- [Opera](#chromium) | [Download](https://www.opera.com/download "Download Opera") (Mac/Win/Linux)
- [Vivaldi Browser](#chromium) | [Download](https://vivaldi.com/download/ "Download Vivaldi Browser") (Mac/Win/Linux)
- [Brave Browser](#chromium) | [Download](https://brave.com/download/ "Download Brave Browser") (Mac/Win/Linux)
- [All other chromium based browsers](#chromium)


## How to install
⚠️ Note: There are two `manifest.json` files. This is due to Mozilla and Google [not liking each other](https://github.com/mozilla/web-ext/issues/2532). For all chromium based browsers, please use the `manifest.json` file at `/schooltape/extension/manifest.json`. For Firefox, please use the `manifest.json` file at `/schooltape/manifest.json`

### Firefox <a name="firefox"></a>
1) Download your preferred release from the [releases page](https://github.com/42willow/schooltape/releases).
2) Unzip the file.
3) Navigate to `about:debugging#/runtime/this-firefox`
4) Click the __Load Temporary Add-on...__ button near the top right, select the folder you downloaded and select `/schooltape/manifest.json` and click ok.
5) Done! Options can be found in the right click context menu, and use left click to toggle.

### Google Chrome <a name="chrome"></a>
1) Download your preferred release from the [releases page](https://github.com/42willow/schooltape/releases).
2) Unzip the file.
3) Navigate to `chrome://extensions`
4) Turn on __Developer Mode__ at the top right.
5) Click the __Load Unpacked__ button near the top left, select the folder you downloaded and navigate to `/schooltape/extension` and click ok.
6) Done! Options can be found in the right click context menu, and use left click to toggle.

### Microsoft Edge <a name="edge"></a>
1) Download your preferred release from the [releases page](https://github.com/42willow/schooltape/releases).
2) Unzip the file.
3) Navigate to `edge://extensions`
4) Turn on __Developer Mode__ near the bottom left.
5) Click the __Load Unpacked__ button near the top right, select the folder you downloaded and navigate to `/schooltape/extension` and click ok.
6) Scroll down until you find a heading that says __From other sources__.
8) Done! Options can be found in the right click context menu, and use left click to toggle.

### All other chromium based browsers <a name="chromium"></a>
Follow the [Google Chrome](#google_chrome) instructions.

## Versioning
This project uses [Semantic Versioning](https://semver.org)

**X**.y.z = Major updates. (Resets y & z when changed.)

x.**Y**.z = New features. (Resets z when changed.)

x.y.**Z** = New bug fixes.
