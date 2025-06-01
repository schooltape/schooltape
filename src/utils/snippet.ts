export async function defineStSnippet(snippetId: SnippetId, styleText: string) {
  const snippet = await snippets[snippetId].storage.getValue();

  logger.info(`${snippets[snippetId].info?.name}: ${snippet.toggle ? "enabled" : "disabled"}`);

  const settings = await globalSettings.storage.getValue();
  const urls = await schoolboxUrls.storage.getValue();

  if (snippet && typeof window !== "undefined" && urls.includes(window.location.origin)) {
    if (settings.global && settings.snippets && snippet.toggle) {
      // inject
      logger.info(`Injecting snippet: ${snippets[snippetId].info?.name}`);
      injectStyles(styleText);
    }
  }
}
