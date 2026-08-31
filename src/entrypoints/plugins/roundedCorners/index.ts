import { Plugin } from "@/utils/plugin";
import styles from "./styles.css?inline";
import { injectInlineStyles, uninjectInlineStyles } from "@/utils";

const ID = "roundedCorners";
const PLUGIN_ID = `plugin-${ID}`;

export default new Plugin(
  {
    id: ID,
    name: "Rounded Corners",
    description: "Rounds most corners in the UI.",
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
