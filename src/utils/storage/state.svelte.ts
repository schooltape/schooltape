import type { WxtStorageItem } from "#imports";
import type { WatchCallback } from "wxt/utils/storage";

export class StorageState<T> {
  public state;
  private storage;

  constructor(storage: WxtStorageItem<T, {}>) {
    this.storage = storage;
    this.state = $state(this.storage.fallback);
    this.init();
  }

  private async init() {
    this.state = (await this.storage.getValue()) ?? this.storage.fallback;

    $effect.root(() => {
      let initialised = false;

      $effect(() => {
        // must read state to establish dependency
        const currentSnapshot = $state.snapshot(this.state);

        if (!initialised) {
          initialised = true;
          return;
        }

        // state -> storage
        this.storage.setValue(currentSnapshot as T);
      });
    });
  }

  get = () => this.storage.getValue();

  set = (newValue: T) => this.storage.setValue(newValue);

  update = async (updates: Partial<T>) =>
    this.set({
      ...(await this.get()),
      ...updates,
    });

  watch = (cb: WatchCallback<T>) => this.storage.watch(cb);
}
