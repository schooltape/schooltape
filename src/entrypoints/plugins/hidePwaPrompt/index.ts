import { Plugin } from "@/utils/plugin";
import styles from "./styles.css?inline";
import { injectInlineStyles, uninjectInlineStyles } from "@/utils";

const ID = "hidePwaPrompt";
const PLUGIN_ID = `plugin-${ID}`;

export default new Plugin(
  {
    id: ID,
    name: "Hide PWA Prompt",
    description: "Hide the prompt in the notifications menu to install Schoolbox as a PWA and enable notifications.",
  },
  true,
  null,
  () => {
    injectInlineStyles(styles, PLUGIN_ID);
  },
  () => {
    uninjectInlineStyles(PLUGIN_ID);
  },
);
