import type { WxtStorageItem } from "#imports";
import type { WatchCallback } from "wxt/utils/storage";
import { logger } from "../logger";

export class StorageState<T> {
  public state;
  private storage;

  constructor(storage: WxtStorageItem<T, {}>) {
    this.storage = storage;
    this.state = $state(this.storage.fallback);

    this.storage.getValue().then(this.updateState);
    this.storage.watch((newState) => this.updateState(newState));
  }

  private updateState = (newState: T | null) => {
    this.state = newState ?? this.storage.fallback;
  };

  watch = (cb: WatchCallback<T>) => this.storage.watch(cb);

  get() {
    return this.storage.getValue();
  }

  set(newValue: T) {
    return this.storage.setValue(newValue);
  }

  async update(updates: Partial<T>) {
    await this.set({
      ...(await this.get()),
      ...updates,
    });
  }
}
