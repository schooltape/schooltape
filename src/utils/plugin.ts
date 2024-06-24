export async function defineStPlugin(pluginID: string, injectLogic: () => void) {
  let plugin = (await pluginSettings.getValue()).plugins[pluginID];
  let settings = await globalSettings.getValue();
  let plugins = await pluginSettings.getValue();

  if (typeof window !== 'undefined' && settings.urls.includes(window.location.origin)) {
    if (
      settings.global &&
      plugins.toggle &&
      plugin.toggle
    ) {
      // inject
      logger.info(`Injecting plugin: ${plugin.name}`);
      injectLogic();
    }
  }
}
