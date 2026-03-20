import { ContentScriptContext as Ctx, storage } from "#imports";
import { Component } from "svelte";
import { hasChanged, onSchoolboxPage } from ".";
import { logger } from "./logger";
import type { Toggle } from "./storage";
import { globalSettings } from "./storage";
import { StorageState } from "./storage/state.svelte";

// TODO: ComponentType is deprecated

export class Plugin<
  Settings extends Record<string, unknown> | null = null,
  Apps extends Record<string, Component> | null = null,
> {
  private injected = false;
  public toggle: StorageState<Toggle>;
  public settings!: Settings;

  private apps?: Apps;

  constructor(
    public meta: {
      id: string;
      name: string;
      description: string;
    },
    defaultToggle: boolean,
    settings: Record<string, object> | null,
    private injectCallback: (settings: Settings, ctx: Ctx, apps?: Apps) => Promise<void> | void,
    private uninjectCallback: (settings: Settings, ctx: Ctx) => Promise<void> | void,
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
      ) as Settings;
    }
  }

  /*
   * initialises the plugin by checking if it is enabled, and if the current page is a Schoolbox page.
   * waits for specific elements to load before injecting.
   *
   * enforces apps is to be passed if the Apps type generic is not null
   */
  async init(ctx: Ctx, ...args: Apps extends Record<string, Component> ? [apps: Apps] : []) {
    if (!(await onSchoolboxPage())) return;

    const apps = args[0] as Apps | undefined;
    this.apps = apps;

    logger.info(`init plugin: ${this.meta.name}`);

    if (await this.isEnabled()) {
      this.waitForElementsThenInject(ctx);
    }

    this.registerWatchers(ctx);
  }

  private inject(ctx: Ctx) {
    if (this.injected) return;
    if (!this.allElementsPresent()) return;
    logger.info(`injecting plugin: ${this.meta.name}`);
    this.injectCallback(this.settings, ctx, this.apps);
    this.injected = true;
  }

  private uninject(ctx: Ctx) {
    if (!this.injected) return;
    logger.info(`uninjecting plugin: ${this.meta.name}`);
    this.uninjectCallback(this.settings, ctx);
    this.injected = false;
  }

  private waitForElementsThenInject(ctx: Ctx) {
    if (this.elementsToWaitFor.length === 0) {
      this.inject(ctx);
      return;
    }

    const observer = new MutationObserver((_mutations, observer) => {
      if (this.allElementsPresent()) {
        observer.disconnect();
        this.inject(ctx);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    if (this.allElementsPresent()) {
      observer.disconnect();
      this.inject(ctx);
    }
  }

  /*
   * reload plugin if toggle or settings are changed
   */
  private registerWatchers(ctx: Ctx) {
    globalSettings.watch((newValue, oldValue) => {
      if (hasChanged(newValue, oldValue, ["global", "plugins"])) this.reload(ctx);
    });

    this.toggle.watch(() => this.reload(ctx));

    if (this.settings) {
      for (const setting of Object.values(this.settings)) {
        if (!(setting instanceof StorageState)) continue;
        setting.watch(this.reload.bind(this));
      }
    }
  }

  private async reload(ctx: Ctx) {
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
