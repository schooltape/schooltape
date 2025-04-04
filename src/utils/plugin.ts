export async function defineStPlugin(
  pluginId: PluginId,
  injectLogic: (pluginId: PluginId) => void,
  elementsToWaitFor: string[] = [],
) {
  const plugin = await plugins[pluginId].getValue();

  logger.info(`${PLUGIN_INFO[pluginId].name}: ${plugin.toggle ? "enabled" : "disabled"}`);

  const settings = await globalSettings.getValue();
  const urls = await schoolboxUrls.getValue();

  if (plugin && typeof window !== "undefined" && urls.includes(window.location.origin)) {
    if (settings.global && settings.plugins && plugin.toggle) {
      const injectPlugin = () => {
        // wait for elements to be loaded
        if (elementsToWaitFor.length > 0) {
          const observer = new MutationObserver((mutations, observer) => {
            const allElementsPresent = elementsToWaitFor.every((selector) => document.querySelector(selector) !== null);
            if (allElementsPresent) {
              observer.disconnect();
              logger.info(`all elements present, injecting plugin: ${PLUGIN_INFO[pluginId].name}`);
              injectLogic(pluginId);
            }
          });

          observer.observe(document.body, { childList: true, subtree: true });

          // Check if elements are already present
          const allElementsPresent = elementsToWaitFor.every((selector) => document.querySelector(selector) !== null);
          if (allElementsPresent) {
            observer.disconnect();
            logger.info(`all elements already present, injecting plugin: ${PLUGIN_INFO[pluginId].name}`);
            injectLogic(pluginId);
          }
        } else {
          // no elements to wait for
          logger.info(`injecting plugin: ${PLUGIN_INFO[pluginId].name}`);
          injectLogic(pluginId);
        }
      };

      if (document.body) {
        injectPlugin();
      } else {
        document.addEventListener("DOMContentLoaded", injectPlugin);
      }
    }
  }
}
