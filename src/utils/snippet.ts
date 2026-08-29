import { storage } from "#imports";
import { injectInlineStyles, onSchoolboxPage, uninjectInlineStyles } from ".";
import { logger } from "./logger";
import type { Toggle } from "./storage";
import { global, snippets } from "./storage";
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
    // init snippet storage
    this.toggle = new StorageState(
      storage.defineItem(`local:snippet-${meta.id}`, {
        fallback: { toggle: defaultToggle },
      }),
    );
  }

  async init() {
    // if not on Schoolbox page
    if (!(await onSchoolboxPage())) return;

    logger.info(`init snippet: ${this.meta.name}`);

    if (await this.isEnabled()) this.inject();

    // init watchers
    // global.watch((newValue, oldValue) => {
    //   if (hasChanged(newValue, oldValue, ["global", "snippets"])) this.reload();
    // });
    // TODO: this file is getting removed before next release
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
    return (await global.get()) && (await snippets.get()) && (await this.toggle.get()).toggle;
  }
}
