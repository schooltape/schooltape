import { storage } from "#imports";
import { StorageState } from "./state.svelte";
import type * as Types from "./types";

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
  config: Record<Types.SnippetId, Types.SnippetConfig>,
): Record<Types.SnippetId, Types.SnippetData> {
  const snippets: Partial<Record<Types.SnippetId, Types.SnippetData>> = {};

  for (const [snippetId, snippetConfig] of Object.entries(config)) {
    const snippet: Types.SnippetData = {
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

  return snippets as Record<Types.SnippetId, Types.SnippetData>;
}
