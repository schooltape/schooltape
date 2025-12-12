import { defineContentScript } from "#imports";
import { EXCLUDE_MATCHES } from "@/utils/constants";
import censor from "./snippets/censor";
import hidePfp from "./snippets/hidePfp";
import hidePwaPrompt from "./snippets/hidePwaPrompt";
import roundedCorners from "./snippets/roundedCorners";

export const snippets = [roundedCorners, hidePfp, hidePwaPrompt, censor];

export default defineContentScript({
  matches: ["<all_urls>"],
  runAt: "document_start",
  excludeMatches: EXCLUDE_MATCHES,
  async main() {
    for (const snippet of snippets) {
      snippet.init();
    }
  },
});
