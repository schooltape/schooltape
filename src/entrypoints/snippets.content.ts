import censor from "./snippets/censor.css?inline";
import hidePfp from "./snippets/hidePfp/styles.css?inline";
import hidePwaPrompt from "./snippets/hidePwaPrompt.css?inline";
import roundedCorners from "./snippets/roundedCorners.css?inline";

export default defineContentScript({
  matches: ["<all_urls>"],
  runAt: "document_start",
  excludeMatches: EXCLUDE_MATCHES,
  async main() {
    defineSnippet("roundedCorners", roundedCorners);
    defineSnippet("hidePfp", hidePfp);
    defineSnippet("hidePwaPrompt", hidePwaPrompt);
    defineSnippet("censor", censor);
  },
});
