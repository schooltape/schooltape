export type SnippetId = "hidePfp" | "censor";

export interface SnippetInfo {
  name: string;
  description: string;
  order: number;
}

export interface SnippetGeneric {
  toggle: boolean;
  // extend this type for snippet-specific settings
}
