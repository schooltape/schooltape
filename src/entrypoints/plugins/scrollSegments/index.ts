import { dataAttr, injectInlineStyles, setDataAttr, uninjectInlineStyles } from "@/utils";
import { Plugin } from "@/utils/plugin";
import styleText from "./styles.css?inline";

const ID = "scrollSegments";
const PLUGIN_ID = `plugin-${ID}`;

export default new Plugin(
  {
    id: ID,
    name: "Scroll Segments",
    description: "Segments the Schoolbox page into scrollable sections.",
  },
  {
    toggle: true,
  },
  () => {
    const footerCopy = document.querySelector(dataAttr(PLUGIN_ID));
    if (footerCopy) return;

    // scroll to top to avoid hot reload bug
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });

    const content = document.querySelector("#content");
    const footer = document.querySelector<HTMLDivElement>("#footer");

    // add copy of footer to content
    if (content && footer) {
      const clone = footer.cloneNode(true) as HTMLDivElement;
      setDataAttr(clone, PLUGIN_ID);
      content.appendChild(clone);
    }

    injectInlineStyles(styleText, PLUGIN_ID);
  },
  () => {
    const footerCopy = document.querySelector(dataAttr(PLUGIN_ID));
    if (!footerCopy) return;

    // remove copy of footer from content
    const content = document.querySelector("#content");
    content?.removeChild(footerCopy);

    uninjectInlineStyles(PLUGIN_ID);
  },
  ["#content", "#footer"],
);
