import { Snippet } from "@/utils/snippet";
import styles from "./styles.css?inline";

export default new Snippet(
  {
    id: "roundedCorners",
    name: "Rounded Corners",
    description: "Rounds most corners in the UI.",
  },
  true,
  styles,
);
