import { storage } from "#imports";
import { StorageState } from "./state.svelte";
import { getClasses } from "serrator/scrapers";
import type { SchoolboxContext } from "serrator/types";

// TODO: use domain everywhere
// record of domain, T
class Cache<T> extends StorageState<Record<string, T> | null> {
  constructor(
    private id: string,
    private helper: (ctx: SchoolboxContext) => T,
  ) {
    super(storage.defineItem(`local:cache-${id}`));
  }

  async refreshCache(ctx: SchoolboxContext) {
    return this.update({ [ctx.domain]: await this.helper(ctx) });
  }
}
const env = {
  domain: import.meta.env.WXT_SCHOOLBOX_DOMAIN,
  jwt: import.meta.env.WXT_SCHOOLBOX_JWT,
};

const ctx = {
  fetchJSON: (url: string) => {},
  fetchDocument: () => {},
  ...env,
};
export const classes = new Cache("classes", getClasses);
classes.refreshCache(ctx);
classes.get();
