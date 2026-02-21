import type { WxtStorageItem } from "#imports";
import type { WatchCallback } from "wxt/utils/storage";

export class StorageState<T> {
  public state;
  private storage;
  public ready: Promise<void>;

  constructor(storage: WxtStorageItem<T, {}>) {
    this.storage = storage;
    this.state = $state(this.storage.fallback);

    this.ready = this.init();
  }

  private async init() {
    this.state = await this.storage.getValue();

    $effect.root(() => {
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

  save = async () => {
    const currentSnapshot = $state.snapshot(this.state);
    await this.storage.setValue(currentSnapshot as T);
  };
  watch = (cb: WatchCallback<T>) => this.storage.watch(cb);
}
