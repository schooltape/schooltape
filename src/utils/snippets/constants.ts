import { SnippetId, SnippetInfo } from "./types";

export const SNIPPET_INFO: Record<SnippetId, SnippetInfo> = {
  hidePfp: {
    name: "Hide PFP",
    description: "Hide your profile picture across Schoolbox.",
    order: 0,
  },
  censor: {
    name: "Censor",
    description: "Censors all text and images. This is intended for development purposes.",
    order: 1,
  },
};
