export async function defineStSnippet(snippetId: SnippetId, styleText: string) {
  const snippet = await snippets[snippetId].getValue();

  logger.info(`${SNIPPET_INFO[snippetId].name}: ${snippet.toggle ? "enabled" : "disabled"}`);

  const settings = await globalSettings.storage.getValue();
  const urls = await schoolboxUrls.getValue();

  if (snippet && typeof window !== "undefined" && urls.includes(window.location.origin)) {
    if (settings.global && settings.snippets && snippet.toggle) {
      // inject
      logger.info(`Injecting snippet: ${SNIPPET_INFO[snippetId].name}`);
      injectStyles(styleText);
    }
  }
}
