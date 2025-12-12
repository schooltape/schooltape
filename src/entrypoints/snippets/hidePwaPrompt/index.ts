import { Snippet } from "@/utils/snippet";
import styles from "./styles.css?inline";

export default new Snippet(
  {
    id: "hidePwaPrompt",
    name: "Hide PWA Prompt",
    description: "Hide the prompt in the notifications menu to install Schoolbox as a PWA and enable notifications.",
  },
  true,
  styles,
);
