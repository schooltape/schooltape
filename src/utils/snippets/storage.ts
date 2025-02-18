import { WxtStorageItem } from "wxt/storage";
import { SnippetGeneric, SnippetId } from "./types";

export const snippets: Record<SnippetId, WxtStorageItem<SnippetGeneric, any>> = {
  hidePfp: storage.defineItem<SnippetGeneric>("local:snippet-hidePfp", {
    fallback: {
      toggle: true,
    },
  }),
  censor: storage.defineItem<SnippetGeneric>("local:snippet-censor", {
    fallback: {
      toggle: false,
    },
  }),
};
