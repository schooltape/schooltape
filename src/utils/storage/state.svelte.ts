import type { WxtStorageItem } from "#imports";

export class StorageState<T> {
  public state;

  constructor(public storage: WxtStorageItem<T, {}>) {
    this.storage = storage;
    this.state = $state(this.storage.fallback);

    this.storage.getValue().then(this.update);
    this.storage.watch((newState) => this.update(newState));
  }

  private update = (newState: T | null) => {
    this.state = newState ?? this.storage.fallback;
  };

  async set(updates: Partial<T>) {
    const newState = {
      ...(await this.storage.getValue()),
      ...updates,
    };

    await this.storage.setValue(newState);
  }

  get() {
    this.storage.getValue().then(this.update);
    return $state.snapshot(this.state) as T;
  }
}
