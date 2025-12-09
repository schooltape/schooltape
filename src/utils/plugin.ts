import { hasChanged } from ".";
import { logger } from "./logger";
import type { PluginId, PluginSetting, Slider } from "./storage";
import { globalSettings, plugins, schoolboxUrls } from "./storage";

export async function definePlugin(
  pluginId: PluginId,
  injectCallback: (settings?: {
    toggle: Record<string, boolean>;
    slider: Record<string, Slider>;
  }) => Promise<void> | void,
  uninjectCallback: (settings?: {
    toggle: Record<string, boolean>;
    slider: Record<string, Slider>;
  }) => Promise<void> | void,
  elementsToWaitFor: string[] = [],
) {
  const plugin = await plugins[pluginId].toggle.storage.getValue();
  let injected = false;

  logger.info(`${plugins[pluginId].name}: ${plugin.toggle ? "enabled" : "disabled"}`);

  const settings = await globalSettings.storage.getValue();
  const urls = (await schoolboxUrls.storage.getValue()).urls;

  if (plugin && typeof window !== "undefined" && urls.includes(window.location.origin)) {
    const allElementsPresent = () => elementsToWaitFor.every((selector) => document.querySelector(selector) !== null);

    const inject = () => {
      if (injected) return;
      if (!allElementsPresent) return;
      logger.info(`injecting plugin: ${plugins[pluginId].name}`);
      injectCallback(getSettingsValues(plugins[pluginId]?.settings));
      injected = true;
    };

    const uninject = () => {
      if (!injected) return;
      logger.info(`uninjecting plugin: ${plugins[pluginId].name}`);
      uninjectCallback(getSettingsValues(plugins[pluginId]?.settings));
      injected = false;
    };

    const initWatchers = () => {
      // add watchers for injecting plugin
      globalSettings.storage.watch((newValue, oldValue) => {
        if (hasChanged(newValue, oldValue, ["global", "plugins"])) {
          if (newValue.global && newValue.plugins && plugin.toggle) {
            inject();
          } else {
            uninject();
          }
        }
      });
      plugins[pluginId].toggle.storage.watch((newValue) => {
        if (newValue.toggle) {
          inject();
        } else {
          uninject();
        }
      });

      // reload plugin if settings have been updated
      if (plugins[pluginId].settings) {
        for (const setting of Object.values(plugins[pluginId].settings)) {
          setting.state.storage.watch(() => {
            uninject();
            if (plugins[pluginId].toggle.get().toggle) inject();
          });
        }
      }
    };

    initWatchers();

    if (settings.global && settings.plugins && plugin.toggle) {
      const initObserver = () => {
        // wait for elements to be loaded

        if (elementsToWaitFor.length > 0) {
          // create an observer to wait for all elements to be loaded
          const observer = new MutationObserver((_mutations, observer) => {
            if (allElementsPresent()) {
              observer.disconnect();
              inject();
            }
          });
          observer.observe(document.body, { childList: true, subtree: true });

          // check if elements are already present
          if (allElementsPresent()) {
            observer.disconnect();
            inject();
          }
        } else {
          // no elements to wait for
          inject();
        }
      };

      if (document.body) {
        initObserver();
      } else {
        document.addEventListener("DOMContentLoaded", initObserver);
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
