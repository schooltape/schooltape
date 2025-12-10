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
  const plugin = await plugins[pluginId].toggle.get();
  let injected = false;

  logger.info(`${plugins[pluginId].name}: ${plugin.toggle ? "enabled" : "disabled"}`);

  const settings = await globalSettings.get();
  const urls = (await schoolboxUrls.get()).urls;

  if (plugin && typeof window !== "undefined" && urls.includes(window.location.origin)) {
    const allElementsPresent = () => elementsToWaitFor.every((selector) => document.querySelector(selector) !== null);

    const inject = async () => {
      if (injected) return;
      if (!allElementsPresent()) return;
      logger.info(`injecting plugin: ${plugins[pluginId].name}`);
      injectCallback(await getSettingsValues(plugins[pluginId]?.settings));
      injected = true;
    };

    const uninject = async () => {
      if (!injected) return;
      logger.info(`uninjecting plugin: ${plugins[pluginId].name}`);
      uninjectCallback(await getSettingsValues(plugins[pluginId]?.settings));
      injected = false;
    };

    const initWatchers = () => {
      // add watchers for injecting plugin
      globalSettings.watch(async (newValue, oldValue) => {
        if (hasChanged(newValue, oldValue, ["global", "plugins"])) {
          const plugin = await plugins[pluginId].toggle.get();
          if (newValue.global && newValue.plugins && plugin.toggle) {
            inject();
          } else {
            uninject();
          }
        }
      });
      plugins[pluginId].toggle.watch((newValue) => {
        if (newValue.toggle) {
          inject();
        } else {
          uninject();
        }
      });

      // reload plugin if settings have been updated
      if (plugins[pluginId].settings) {
        for (const setting of Object.values(plugins[pluginId].settings)) {
          setting.state.watch(async () => {
            uninject();
            if ((await plugins[pluginId].toggle.get()).toggle) inject();
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

async function getSettingsValues(settings?: Record<string, PluginSetting>) {
  if (!settings) return undefined;

  const result: {
    toggle: Record<string, boolean>;
    slider: Record<string, Slider>;
  } = { toggle: {}, slider: {} };
  for (const [key, setting] of Object.entries(settings)) {
    if (setting.type === "toggle") {
      result.toggle[key] = (await setting.state.get()).toggle;
    } else if (setting.type === "slider") {
      result.slider[key] = await setting.state.get();
    }
  }
  return result;
}
