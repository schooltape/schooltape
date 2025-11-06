import { StorageState } from "./state.svelte";
import * as Types from "./types";

export function createPlugin(
  id: string,
  name: string,
  description: string,
  fallbackToggle: boolean,
  settings?: Record<string, Types.PluginSetting>,
) {
  const plugin: Types.PluginData = {
    toggle: new StorageState(
      storage.defineItem<Types.ToggleState>(`local:plugin-${id}`, {
        fallback: {
          toggle: fallbackToggle,
        },
      }),
      true,
    ),
    info: {
      name,
      description,
    },
  };

  if (settings) {
    plugin.settings = settings;
  }

  return plugin;
}

export function pluginToggle(
  pluginId: Types.PluginId,
  settingId: string,
  name: string,
  description: string,
  fallback: boolean,
): Types.PluginSetting {
  return {
    type: "toggle",
    state: new StorageState(
      storage.defineItem<Types.ToggleState>(`local:${pluginId}-${settingId}`, {
        fallback: { toggle: fallback },
      }),
    ),
    info: { name, description },
  };
}

export function pluginSlider(
  pluginId: Types.PluginId,
  settingId: string,
  name: string,
  description: string,
  min: number,
  max: number,
  fallback: number,
): Types.PluginSetting {
  return {
    type: "slider",
    state: new StorageState(
      storage.defineItem<Types.SliderState>(`local:${pluginId}-${settingId}`, {
        fallback: { value: fallback, min, max },
      }),
    ),
    info: { name, description },
  };
}

export function createSnippet(id: string, name: string, description: string, fallbackToggle: boolean) {
  return {
    toggle: new StorageState(
      storage.defineItem<Types.ToggleState>(`local:snippet-${id}`, {
        fallback: {
          toggle: fallbackToggle,
        },
      }),
      true,
    ),
    info: {
      name,
      description,
    },
  };
}
