export async function defineStPlugin(pluginID: string, injectLogic: () => void) {
  let plugin = populateItems((await pluginSettings.getValue()).plugins, PLUGIN_INFO, "plugin").find((plugin) => plugin.id === pluginID);
  let settings = await globalSettings.getValue();
  let plugins = await pluginSettings.getValue();

  if (plugin && typeof window !== "undefined" && settings.urls.includes(window.location.origin)) {
    if (settings.global && plugins.toggle && plugin.toggle) {
      // inject
      logger.info(`Injecting plugin: ${plugin.name}`);
      injectLogic();
    }
  }
}
