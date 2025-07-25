export async function defineStPlugin(
  pluginId: PluginId,
  injectLogic: (id: PluginId, data: PluginData) => void,
  elementsToWaitFor: string[] = [],
) {
  const plugin = await plugins[pluginId].toggle.storage.getValue();

  logger.info(`${plugins[pluginId].info.name}: ${plugin.toggle ? "enabled" : "disabled"}`);

  const settings = await globalSettings.storage.getValue();
  const urls = (await schoolboxUrls.storage.getValue()).urls;

  if (plugin && typeof window !== "undefined" && urls.includes(window.location.origin)) {
    if (settings.global && settings.plugins && plugin.toggle) {
      const injectPlugin = () => {
        // wait for elements to be loaded
        if (elementsToWaitFor.length > 0) {
          const observer = new MutationObserver((_mutations, observer) => {
            const allElementsPresent = elementsToWaitFor.every((selector) => document.querySelector(selector) !== null);
            if (allElementsPresent) {
              observer.disconnect();
              logger.info(`all elements present, injecting plugin: ${plugins[pluginId].info.name}`);
              injectLogic(pluginId, plugins[pluginId]);
            }
          });

          observer.observe(document.body, { childList: true, subtree: true });

          // Check if elements are already present
          const allElementsPresent = elementsToWaitFor.every((selector) => document.querySelector(selector) !== null);
          if (allElementsPresent) {
            observer.disconnect();
            logger.info(`all elements already present, injecting plugin: ${plugins[pluginId].info.name}`);
            injectLogic(pluginId, plugins[pluginId]);
          }
        } else {
          // no elements to wait for
          logger.info(`injecting plugin: ${plugins[pluginId].info.name}`);
          injectLogic(pluginId, plugins[pluginId]);
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
