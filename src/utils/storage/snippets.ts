import { StorageState } from "./state.svelte";
import * as Types from "./types";

export const snippetConfig: Record<Types.SnippetId, Types.SnippetConfig> = {
  roundedCorners: {
    name: "Rounded Corners",
    description: "Adds rounded corners to all elements across Schoolbox.",
    default: true,
  },

  hidePfp: {
    name: "Hide PFP",
    description: "Hide your profile picture across Schoolbox.",
    default: true,
  },

  hidePwaPrompt: {
    name: "Hide PWA Prompt",
    description: "Hides the prompt in the notifications menu to install Schoolbox as a PWA and enable notifications.",
    default: true,
  },

  censor: {
    name: "Censor",
    description: "Censors all text and images. This is intended for development purposes.",
    default: false,
  },
};

export const snippets = buildSnippetsFromConfig(snippetConfig);

function buildSnippetsFromConfig(
  config: Record<SnippetId, Types.SnippetConfig>,
): Record<Types.SnippetId, Types.Snippet> {
  const snippets: Partial<Record<Types.SnippetId, Types.Snippet>> = {};

  for (const [snippetId, snippetConfig] of Object.entries(config)) {
    const snippet: Types.Snippet = {
      name: snippetConfig.name,
      description: snippetConfig.description,
      toggle: new StorageState(
        storage.defineItem<Types.Toggle>(`local:snippet-${snippetId}`, {
          fallback: { toggle: snippetConfig.default },
        }),
        true,
      ),
    };

    snippets[snippetId as Types.SnippetId] = snippet;
  }

  return snippets as Record<Types.SnippetId, Types.Snippet>;
}
