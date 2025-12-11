import { storage } from "#imports";
import { hasChanged } from ".";
import { logger } from "./logger";
import type { Toggle } from "./storage";
import { globalSettings } from "./storage";
import { StorageState } from "./storage/state.svelte";

export class Plugin<T extends Record<string, StorageState<any>> | undefined = undefined> {
  private injected = false;
  public toggle: StorageState<Toggle>;
  public settings!: T;

  constructor(
    public meta: {
      id: string;
      name: string;
      description: string;
    },
    defaultConfig: {
      toggle: boolean;
      settings?: Record<string, object>;
    },
    private injectCallback: (settings: T) => Promise<void> | void,
    private uninjectCallback: (settings: T) => Promise<void> | void,
    private elementsToWaitFor: string[] = [],
  ) {
    this.meta = meta;
    this.elementsToWaitFor = elementsToWaitFor;
    this.injectCallback = injectCallback;
    this.uninjectCallback = uninjectCallback;

    // init plugin storage
    this.toggle = new StorageState(
      storage.defineItem(`local:plugin-${meta.id}`, {
        fallback: { toggle: defaultConfig.toggle },
      }),
    );
    if (defaultConfig.settings) {
      this.settings = Object.fromEntries(
        Object.entries(defaultConfig.settings).map(([key, value]) => [
          key,
          new StorageState(
            storage.defineItem(`local:plugin-${meta.id}-${key}`, {
              fallback: value,
            }),
          ),
        ]),
      ) as T;
    }
  }

  async init() {
    if (await this.isEnabled()) this.initObserver();

    // init watchers
    globalSettings.watch((newValue, oldValue) => {
      if (hasChanged(newValue, oldValue, ["global", "plugins"])) this.reload();
    });
    this.toggle.watch(this.reload);
    if (this.settings) {
      for (const setting of Object.values(this.settings)) {
        setting.watch(this.reload);
      }
    }
  }

  async reload() {
    if (this.injected) this.uninject();
    if (await this.isEnabled()) this.inject();
  }

  private initObserver() {
    // wait for elements to be loaded
    if (this.elementsToWaitFor.length > 0) {
      // create an observer to wait for all elements to be loaded
      const observer = new MutationObserver((_mutations, observer) => {
        if (this.allElementsPresent()) {
          observer.disconnect();
          this.inject();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });

      // check if elements are already present
      if (this.allElementsPresent()) {
        observer.disconnect();
        this.inject();
      }
    } else {
      // no elements to wait for
      this.inject();
    }
  }

  private inject() {
    if (this.injected) return;
    if (!this.allElementsPresent()) return;
    logger.info(`injecting plugin: ${this.meta.name}`);
    this.injectCallback(this.settings);
    this.injected = true;
  }

  private uninject() {
    if (!this.injected) return;
    logger.info(`uninjecting plugin: ${this.meta.name}`);
    this.uninjectCallback(this.settings);
    this.injected = false;
  }

  private async isEnabled(): Promise<boolean> {
    const settings = await globalSettings.get();
    const toggle = await this.toggle.get();

    return settings.global && settings.plugins && toggle.toggle;
  }

  private allElementsPresent() {
    return this.elementsToWaitFor.every((selector) => document.querySelector(selector) !== null);
  }
}
