import { Snippet } from "@/utils/snippet";
import styles from "./styles.css?inline";

export default new Snippet(
  {
    id: "hidePfp",
    name: "Hide Profile Picture",
    description: "Hide your profile picture across Schoolbox.",
  },
  true,
  styles,
);
