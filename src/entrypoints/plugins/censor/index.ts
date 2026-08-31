import { Plugin } from "@/utils/plugin";
import styles from "./styles.css?inline";
import { injectInlineStyles, uninjectInlineStyles } from "@/utils";

const ID = "censor";
const PLUGIN_ID = `plugin-${ID}`;

export default new Plugin(
  {
    id: ID,
    name: "Censor",
    description: "Censors all text and images. This is intended for development purposes.",
  },
  false,
  null,
  () => {
    injectInlineStyles(styles, PLUGIN_ID);
  },
  () => {
    uninjectInlineStyles(PLUGIN_ID);
  },
);
