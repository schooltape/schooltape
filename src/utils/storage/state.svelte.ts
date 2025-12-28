import type { WxtStorageItem } from "#imports";
import type { WatchCallback } from "wxt/utils/storage";

export class StorageState<T> {
  public state;
  protected storage;

  constructor(storage: WxtStorageItem<T, {}>) {
    this.storage = storage;
    this.state = $state(this.storage.fallback);

    this.storage.getValue().then(this.updateState);
    this.storage.watch((newState) => this.updateState(newState));
  }

  protected updateState(newState: T) {
    this.state = newState ?? this.storage.fallback;
  }

  watch = (cb: WatchCallback<T>) => this.storage.watch(cb);

  get() {
    return this.storage.getValue();
  }

  set(newValue: T) {
    return this.storage.setValue(newValue);
  }

  async update(updates: Partial<T>) {
    const currentState = await this.get();

    const baseState = currentState ?? this.storage.fallback;

    if (baseState) {
      await this.set({
        ...baseState,
        ...updates,
      });
    }
  }
}
