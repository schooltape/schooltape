export async function definePlugin(
  pluginId: PluginId,
  callback: (settings?: { toggle: Record<string, boolean>; slider: Record<string, Slider> }) => Promise<void> | void,
  elementsToWaitFor: string[] = [],
) {
  const plugin = await plugins[pluginId].toggle.storage.getValue();

  logger.info(`${plugins[pluginId].name}: ${plugin.toggle ? "enabled" : "disabled"}`);

  const settings = await globalSettings.storage.getValue();
  const urls = (await schoolboxUrls.storage.getValue()).urls;

  if (plugin && typeof window !== "undefined" && urls.includes(window.location.origin)) {
    if (settings.global && settings.plugins && plugin.toggle) {
      const injectPlugin = () => {
        callback(getSettingsValues(plugins[pluginId]?.settings));
      };

      const loadPlugin = () => {
        // wait for elements to be loaded
        if (elementsToWaitFor.length > 0) {
          const observer = new MutationObserver((_mutations, observer) => {
            const allElementsPresent = elementsToWaitFor.every((selector) => document.querySelector(selector) !== null);
            if (allElementsPresent) {
              observer.disconnect();
              logger.info(`all elements present, injecting plugin: ${plugins[pluginId].name}`);
              injectPlugin();
            }
          });

          observer.observe(document.body, { childList: true, subtree: true });

          // check if elements are already present
          const allElementsPresent = elementsToWaitFor.every((selector) => document.querySelector(selector) !== null);
          if (allElementsPresent) {
            observer.disconnect();
            logger.info(`all elements already present, injecting plugin: ${plugins[pluginId].name}`);
            injectPlugin();
          }
        } else {
          // no elements to wait for
          logger.info(`injecting plugin: ${plugins[pluginId].name}`);
          injectPlugin();
        }
      };

      if (document.body) {
        loadPlugin();
      } else {
        document.addEventListener("DOMContentLoaded", loadPlugin);
      }
    }
  }
}

function getSettingsValues(settings?: Record<string, PluginSetting>) {
  if (!settings) return undefined;

  const result: {
    toggle: Record<string, boolean>;
    slider: Record<string, Slider>;
  } = { toggle: {}, slider: {} };
  for (const [key, setting] of Object.entries(settings)) {
    if (setting.type === "toggle") {
      const value = setting.state.get();
      result.toggle[key] = value.toggle;
    } else if (setting.type === "slider") {
      const value = setting.state.get();
      result.slider[key] = value;
    }
  }
  return result;
}
