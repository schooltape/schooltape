import { WxtStorageItem } from "#imports";

export class StorageState<T, I = {}> {
  public state;

  constructor(
    public storage: WxtStorageItem<T, {}>,
    public info?: I,
  ) {
    this.info = info;
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

  get() {
    this.storage.getValue().then(this.update);
    return $state.snapshot(this.state) as T;
  }
}
