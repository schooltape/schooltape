export async function defineStSnippet(snippetId: SnippetId, styleText: string) {
  let snippet = await snippets[snippetId].getValue();

  logger.info(`${SNIPPET_INFO[snippetId].name}: ${snippet.toggle ? "enabled" : "disabled"}`);

  let settings = await globalSettings.getValue();
  let urls = await schoolboxUrls.getValue();

  if (snippet && typeof window !== "undefined" && urls.includes(window.location.origin)) {
    if (settings.global && settings.snippets && snippet.toggle) {
      // inject
      logger.info(`Injecting snippet: ${SNIPPET_INFO[snippetId].name}`);
      injectStyles(styleText);
    }
  }
}
