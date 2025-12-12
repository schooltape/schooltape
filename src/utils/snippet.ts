import { storage } from "#imports";
import { hasChanged, injectInlineStyles, uninjectInlineStyles } from ".";
import { logger } from "./logger";
import type { Toggle } from "./storage";
import { globalSettings } from "./storage";
import { StorageState } from "./storage/state.svelte";

export class Snippet {
  private injected = false;
  public toggle: StorageState<Toggle>;

  constructor(
    public meta: {
      id: string;
      name: string;
      description: string;
    },
    defaultToggle: boolean,
    private styleText: string,
  ) {
    this.meta = meta;
    this.styleText = styleText; // TODO: check if can remove this

    // init snippet storage
    this.toggle = new StorageState(
      storage.defineItem(`local:snippet-${meta.id}`, {
        fallback: { toggle: defaultToggle },
      }),
    );
  }

  async init() {
    logger.info(`init snippet: ${this.meta.name}`);

    if (await this.isEnabled()) this.inject();

    // init watchers
    globalSettings.watch((newValue, oldValue) => {
      if (hasChanged(newValue, oldValue, ["global", "snippets"])) this.reload();
    });
    this.toggle.watch(this.reload.bind(this));
  }

  private inject() {
    if (this.injected) return;
    logger.info(`injecting snippet: ${this.meta.name}`);
    injectInlineStyles(this.styleText, `snippet-${this.meta.id}`);
    this.injected = true;
  }

  private uninject() {
    if (!this.injected) return;
    logger.info(`uninjecting snippet: ${this.meta.name}`);
    uninjectInlineStyles(`snippet-${this.meta.id}`);
    this.injected = false;
  }

  private async reload() {
    if (this.injected) this.uninject();
    if (await this.isEnabled()) this.inject();
  }

  private async isEnabled(): Promise<boolean> {
    const settings = await globalSettings.get();
    const toggle = await this.toggle.get();

    return settings.global && settings.snippets && toggle.toggle;
  }
}
