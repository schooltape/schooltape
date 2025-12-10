import { hasChanged, injectInlineStyles, uninjectInlineStyles } from ".";
import { logger } from "./logger";
import type { SnippetId } from "./storage";
import { globalSettings, schoolboxUrls, snippets } from "./storage";

export async function defineSnippet(snippetId: SnippetId, styleText: string) {
  const snippet = await snippets[snippetId].toggle.get();
  const inject = () => {
    logger.info(`injecting snippet: ${snippets[snippetId].name}`);
    injectInlineStyles(styleText, `snippet-${snippetId}`);
  };
  const uninject = () => {
    logger.info(`uninjecting snippet: ${snippets[snippetId].name}`);
    uninjectInlineStyles(`snippet-${snippetId}`);
  };

  logger.info(`${snippets[snippetId].name}: ${snippet.toggle ? "enabled" : "disabled"}`);

  const settings = await globalSettings.get();
  const urls = (await schoolboxUrls.get()).urls;

  if (snippet && typeof window !== "undefined" && urls.includes(window.location.origin)) {
    if (settings.global && settings.snippets && snippet.toggle) {
      // inject
      inject();
    }
  }

  // settings watcher for uninjection/injection
  globalSettings.watch(async (newValue, oldValue) => {
    if (hasChanged(newValue, oldValue, ["global", "snippets"])) {
      const snippet = await snippets[snippetId].toggle.get();
      if (newValue.global && newValue.snippets && snippet.toggle) {
        inject();
      } else {
        uninject();
      }
    }
  });
  snippets[snippetId].toggle.watch(async (newValue, oldValue) => {
    if (hasChanged(newValue, oldValue, ["toggle"])) {
      const settings = await globalSettings.get();
      if (newValue.toggle && settings.global && settings.snippets) {
        inject();
      } else {
        uninject();
      }
    }
  });
}
