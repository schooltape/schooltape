import type { WxtStorageItem } from "#imports";
import type { WatchCallback } from "wxt/utils/storage";
import { logger } from "../logger";

export class StorageState<T> {
  private _state;
  private _isReady = false;
  private storage;
  public ready: Promise<void>;

  constructor(storage: WxtStorageItem<T, {}>) {
    this.storage = storage;
    this._state = $state(this.storage.fallback);

    this.ready = this.init();
  }

  get state() {
    if (!$effect.tracking()) {
      throw new Error("[storage state] procedural code accessing state");
    }
    if (!this._isReady) {
      logger.warn(`[storage state] race condition detected! you accessed state before storage loaded.`);
    }
    return this._state;
  }

  set state(value) {
    this._state = value;
  }

  private async init() {
    this._state = (await this.storage.getValue()) ?? this.storage.fallback;
    this._isReady = true; // safe to read

    let isExternalUpdate = false;

    // inbound sync: storage -> state
    this.storage.watch((newValue) => {
      isExternalUpdate = true; // lock outbound
      this.state = newValue ?? this.storage.fallback;
    });

    $effect.root(() => {
      let initialised = false;

      $effect(() => {
        // must read state to establish dependency
        const currentSnapshot = $state.snapshot(this.state);

        if (!initialised) {
          initialised = true;
          return;
        }

        if (isExternalUpdate) {
          isExternalUpdate = false;
          return;
        }

        // outbound sync: state -> storage
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
