import { Plugin } from "@/utils/plugin";
import styles from "./styles.css?inline";
import { injectInlineStyles, uninjectInlineStyles } from "@/utils";

const ID = "hidePfp";
const PLUGIN_ID = `plugin-${ID}`;

export default new Plugin(
  {
    id: ID,
    name: "Hide Profile Picture",
    description: "Hide your profile picture across Schoolbox.",
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
