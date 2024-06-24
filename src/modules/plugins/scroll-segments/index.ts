import styleText from "./scroll-segments.css?inline";

export default defineWxtPlugin(() => {
  defineStPlugin("scroll-segments", () => {
    const content = document.getElementById("content");
    const footer = document.getElementById("footer");
    if (content && footer) {
      content.appendChild(footer);
    }
    injectStyles(styleText);
  });
});
