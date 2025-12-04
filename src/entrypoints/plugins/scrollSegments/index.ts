import { injectInlineStyles } from "@/utils";
import { definePlugin } from "@/utils/plugin";
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
      injectInlineStyles(styleText, "plugin-scrollSegments");
    },
    () => {},
    ["#content", "#footer"],
  );
}
