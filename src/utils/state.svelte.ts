// import { globalSettings.storage } from "./storage";
// import * as Types from "./types";

// class globalSettings {
//   state = $state(globalSettings.storage.fallback);

//   constructor() {
//     globalSettings.storage.getValue().then(this.update);
//     globalSettings.storage.watch(this.update);
//   }

//   update = async (newState: Types.Settings | null) => {
//     this.state = newState ?? globalSettings.storage.fallback;
//   };

//   async set(updates: Partial<Types.Settings>) {
//     // state will be updated due to watch
//     await globalSettings.storage.setValue({
//       ...$state.snapshot(this.state),
//       ...updates,
//     });
//   }
// }

// export const globalSettings = new globalSettings();

import { WxtStorageItem } from "#imports";

export class StorageState<T> {
  public state;

  constructor(public storage: WxtStorageItem<T, {}>) {
    this.storage = storage;
    this.state = $state(this.storage.fallback);

    this.storage.getValue().then(this.update);
    this.storage.watch(this.update);
  }

  private update = (newState: T | null) => {
    this.state = newState ?? this.storage.fallback;
  };

  async set(updates: Partial<T>) {
    const newState = {
      ...($state.snapshot(this.state) as T),
      ...updates,
    };

    await this.storage.setValue(newState);
  }
}
