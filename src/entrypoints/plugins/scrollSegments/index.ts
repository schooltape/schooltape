import styleText from "./styles.css?inline";

export default function init() {
  definePlugin(
    "scrollSegments",
    () => {
      const content = document.getElementById("content");
      const footer = document.getElementById("footer");
      if (content && footer) {
        content.appendChild(footer);
      }
      injectStyles(styleText);
    },
    ["#content", "#footer"],
  );
}
