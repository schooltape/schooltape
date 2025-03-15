import styleText from "./styles.css?inline";
import { dndzone } from "svelte-dnd-action";
import Switcharoo from "./switcharoo.svelte";

export default function init() {
  defineStPlugin("switcharoo", async () => {
    const footer = document.getElementById("footer");
    const content = document.getElementById("content");
    if (content) {
      const switcharoo = new Switcharoo({
        target: content,
      });
      if (footer) {
        content.appendChild(footer);
      }
    } else {
      logger.error("Could not find content element");
    }
    injectStyles(styleText);
  });
}
