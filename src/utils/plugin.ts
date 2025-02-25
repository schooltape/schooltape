export async function defineStPlugin(pluginId: PluginId, injectLogic: (pluginId: PluginId) => void) {
  let plugin = await plugins[pluginId].getValue();

  logger.info(`${PLUGIN_INFO[pluginId].name}: ${plugin.toggle ? "enabled" : "disabled"}`);

  let settings = await globalSettings.getValue();

  if (plugin && typeof window !== "undefined" && settings.urls.includes(window.location.origin)) {
    if (settings.global && settings.plugins && plugin.toggle) {
      // inject
      logger.info(`Injecting plugin: ${PLUGIN_INFO[pluginId].name}`);
      injectLogic(pluginId);
    }
  }
}
