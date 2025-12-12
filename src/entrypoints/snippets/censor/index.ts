import { Snippet } from "@/utils/snippet";
import styles from "./styles.css?inline";

export default new Snippet(
  {
    id: "censor",
    name: "Censor",
    description: "Censors all text and images. This is intended for development purposes.",
  },
  false,
  styles,
);
