import type { WxtStorageItem } from "#imports";
import type { WatchCallback } from "wxt/utils/storage";

export class StorageState<T> {
  public state;
  private storage;
  private cleanupRoot = () => {}; // TODO: cleanup?

  constructor(storage: WxtStorageItem<T, {}>) {
    this.storage = storage;
    this.state = $state(this.storage.fallback);

    this.init();
  }

  private async init() {
    this.state = await this.storage.getValue();

    this.cleanupRoot = $effect.root(() => {
      let initialised = false;

      $effect(() => {
        const currentSnapshot = $state.snapshot(this.state);

        if (!initialised) {
          initialised = true;
          return;
        }

        this.storage.setValue(currentSnapshot as T);
      });
    });
  }

  get = () => this.storage.getValue();
  watch = (cb: WatchCallback<T>) => this.storage.watch(cb);
  destroy = () => this.cleanupRoot();
}
