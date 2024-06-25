import styleText from "./styles.css?inline";

export default defineWxtPlugin(() => {
  defineStPlugin("scrollSegments", () => {
    const content = document.getElementById("content");
    const footer = document.getElementById("footer");
    if (content && footer) {
      content.appendChild(footer);
    }
    injectStyles(styleText);
  });
});
