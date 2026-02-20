import type { WxtStorageItem } from "#imports";
import type { WatchCallback } from "wxt/utils/storage";

export class StorageState<T> {
  public state;
  private storage;
  private init;
  private initPromise: Promise<void>;
  private initResolve?: () => void;

  constructor(storage: WxtStorageItem<T, {}>) {
    this.storage = storage;
    this.state = $state(this.storage.fallback);
    this.init = false;

    this.initPromise = new Promise((resolve) => {
      this.initResolve = resolve;
    });

    this.storage.getValue().then((value) => {
      this.updateState(value);

      $effect.root(() => {
        if (!this.init) return;
        $effect(() => {
          this.storage.setValue($state.snapshot(this.state) as T);
        });
      });
    });
  }

  get = () => this.storage.getValue();

  waitForInit = () => this.initPromise;

  private updateState = (newState: T | null) => {
    this.state = newState ?? this.storage.fallback;

    this.init = true;
    if (this.initResolve) {
      this.initResolve();
    }
  };

  watch = (cb: WatchCallback<T>) => this.storage.watch(cb);
}
