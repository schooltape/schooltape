import { storage } from "#imports";
import type { ContentScriptContext } from "#imports";
import { hasChanged, onSchoolboxPage } from ".";
import { logger } from "./logger";
import type { Toggle } from "./storage";
import { globalSettings } from "./storage";
import { StorageState } from "./storage/state.svelte";

export class Plugin<T extends Record<string, unknown> | undefined = undefined> {
  private injected = false;
  public toggle: StorageState<Toggle>;
  public settings!: T;
  public menu: string | undefined;

  constructor(
    public meta: {
      id: string;
      name: string;
      description: string;
    },
    defaultToggle: boolean,
    settings: Record<string, object> | null,
    private injectCallback: (ctx: ContentScriptContext, settings: T) => Promise<void> | void,
    private uninjectCallback: (ctx: ContentScriptContext, settings: T) => Promise<void> | void,
    private elementsToWaitFor: string[] = [],
  ) {
    // init plugin storage
    this.toggle = new StorageState(
      storage.defineItem(`local:plugin-${meta.id}`, {
        fallback: { toggle: defaultToggle },
      }),
    );
    if (settings) {
      this.settings = Object.fromEntries(
        Object.entries(settings).map(([key, value]) => [
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

  async init(ctx: ContentScriptContext) {
    // if not on Schoolbox page
    if (!(await onSchoolboxPage())) return;

    logger.info(`init plugin: ${this.meta.name}`);

    if (await this.isEnabled()) {
      // wait for elements to be loaded
      if (this.elementsToWaitFor.length > 0) {
        // create an observer to wait for all elements to be loaded
        const observer = new MutationObserver((_mutations, observer) => {
          if (this.allElementsPresent()) {
            observer.disconnect();
            this.inject(ctx);
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // check if elements are already present
        if (this.allElementsPresent()) {
          observer.disconnect();
          this.inject(ctx);
        }
      } else {
        // no elements to wait for
        this.inject(ctx);
      }
    }

    // init watchers
    globalSettings.watch((newValue, oldValue) => {
      if (hasChanged(newValue, oldValue, ["global", "plugins"])) this.reload(ctx);
    });
    this.toggle.watch(() => this.reload(ctx));
    if (this.settings) {
      for (const setting of Object.values(this.settings)) {
        if (!(setting instanceof StorageState)) continue;
        setting.watch(() => this.reload(ctx));
      }
    }
  }

  private inject(ctx: ContentScriptContext) {
    if (this.injected) return;
    if (!this.allElementsPresent()) return;
    logger.info(`injecting plugin: ${this.meta.name}`);
    this.injectCallback(ctx, this.settings);
    this.injected = true;
  }

  private uninject(ctx: ContentScriptContext) {
    if (!this.injected) return;
    logger.info(`uninjecting plugin: ${this.meta.name}`);
    this.uninjectCallback(ctx, this.settings);
    this.injected = false;
  }

  private async reload(ctx: ContentScriptContext) {
    if (this.injected) this.uninject(ctx);
    if (await this.isEnabled()) this.inject(ctx);
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
