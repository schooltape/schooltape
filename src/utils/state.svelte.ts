import { globalSettings } from "./storage";
import * as Types from "./types";

class GlobalSettingsState {
  state = $state(globalSettings.fallback);

  constructor() {
    globalSettings.getValue().then(this.update);
    globalSettings.watch(this.update);
  }

  update = async (newState: Types.Settings | null) => {
    this.state = newState ?? globalSettings.fallback;
  };

  async set(updates: Partial<Types.Settings>) {
    // state will be updated due to watch
    await globalSettings.setValue({
      ...$state.snapshot(this.state),
      ...updates,
    });
  }
}

export const globalSettingsState = new GlobalSettingsState();
