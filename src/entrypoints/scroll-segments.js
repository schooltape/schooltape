import "~/assets/scroll-segments.css"

export default defineUnlistedScript(() => {
  try {
    const content = document.getElementById("content");
    const footer = document.getElementById("footer");
    content.appendChild(footer);
    injectCSS("assets/scroll-segments.css");
  } catch (e) {
    console.error(e);
  }
});
