import { createSnippet } from "./helpers";
import * as Types from "./types";

export const snippets: Record<Types.SnippetId, Types.SnippetData> = {
  roundedCorners: createSnippet(
    "roundedCorners",
    "Rounded Corners",
    "Adds rounded corners to all elements across Schoolbox.",
    true,
  ),

  hidePfp: createSnippet("hidePfp", "Hide PFP", "Hide your profile picture across Schoolbox.", true),

  hidePwaPrompt: createSnippet(
    "hidePwaPrompt",
    "Hide PWA Prompt",
    "Hides the prompt in the notifications menu to install Schoolbox as a PWA and enable notifications.",
    true,
  ),

  censor: createSnippet(
    "censor",
    "Censor",
    "Censors all text and images. This is intended for development purposes.",
    false,
  ),
};
