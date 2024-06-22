export async function defineStPlugin(pluginName: string, injectLogic: () => void) {
  let settings = await globalSettings.getValue();
  let plugins = await pluginSettings.getValue();

  if (settings.urls.includes(window.location.origin)) {
    if (
      settings.global &&
      plugins.toggle &&
      plugins.enabled.includes(pluginName)
    ) {
      // inject
      logger.info(`Injecting plugin: ${pluginName}`);
      injectLogic();
    }
  }
}
