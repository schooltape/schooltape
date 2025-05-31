<script lang="ts">
  import Title from "../components/Title.svelte";
  import { globalSettings } from "#imports";
  import IconBtn from "../components/inputs/IconBtn.svelte";
  import { Settings } from "lucide-svelte";
  import Modal from "../components/Modal.svelte";
  import ToggleComponent from "../components/inputs/Toggle.svelte";

  let showModal = $state(false);
  let selectedPluginId: PluginId | undefined = $state();
  let selectedPlugin: StorageState<globalThis.PluginGeneric, globalThis.PluginInfo> | undefined = $derived.by(() => {
    if (selectedPluginId !== undefined) {
      return plugins[selectedPluginId];
    }
  });
  let hydratedSettings: Record<string, Setting> = $derived.by(() => {
    let hydrated: Record<string, Setting> = {};
    if (selectedPlugin === undefined || selectedPlugin.state.settings === undefined) {
      return hydrated;
    }
    for (const [type, settings] of Object.entries(selectedPlugin.state.settings)) {
      for (const [id, setting] of Object.entries(settings)) {
        switch (type) {
          case "toggle":
            hydrated[id] = hydrate(Toggle, JSON.stringify(setting));
            break;
          case "slider":
            hydrated[id] = hydrate(Slider, JSON.stringify(setting));
            break;
        }
      }
    }
    return hydrated;
  });

  // https://www.stevefenton.co.uk/blog/2018/11/create-and-hydrate-a-typescript-class-from-json/
  function hydrate<T>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constr: { new (...args: any[]): T },
    data: string,
    strictMode: boolean = true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
  ): T {
    const obj = JSON.parse(data);
    const instance = new constr(...args);

    for (const key in obj) {
      if (!strictMode || Object.prototype.hasOwnProperty.call(instance, key)) {
        // @ts-expect-error expected to match the correct structure
        instance[key] = obj[key];
      }
    }
    return instance;
  }
</script>

<div id="card">
  <Title
    title="Plugins"
    checked={globalSettings.state.plugins}
    update={(toggled: boolean) => {
      globalSettings.set({ plugins: toggled });
    }} />

  <div class="plugins-container">
    {#each Object.entries(plugins) as [id, plugin] (id)}
      <div class="my-4 group">
        <ToggleComponent
          {id}
          checked={plugin.state.toggle}
          update={(toggled: boolean) => {
            plugin.set({ toggle: toggled });
          }}
          text={plugin.info?.name}
          description={plugin.info?.description}
          size="small">
          {#if plugin.state.settings}
            <IconBtn
              title="Wiki"
              id="wiki"
              onclick={() => {
                selectedPluginId = id as PluginId;
                showModal = true;
              }}><Settings /></IconBtn>
          {/if}
        </ToggleComponent>
      </div>
    {/each}
  </div>
</div>

{#if selectedPlugin !== undefined && selectedPlugin.state.settings !== undefined}
  <Modal bind:showModal>
    {#snippet header()}
      <h2 class="mb-4 text-xl">{selectedPlugin.info?.name}</h2>
    {/snippet}
    {#each Object.entries(hydratedSettings) as [id, setting] (id)}
      {#if setting instanceof Toggle}
        <ToggleComponent
          text={setting.name}
          description={setting.description}
          size="small"
          checked={setting.toggled}
          update={async () => {
            setting.toggle();
            selectedPlugin.set({
              settings: {
                ...selectedPlugin.get().settings,
                toggle: {
                  ...selectedPlugin.get().settings?.toggle,
                  [id]: setting,
                },
              },
            });
          }}
          id={setting.name} />
      {:else if setting instanceof Slider}
        slider
      {/if}
    {/each}
  </Modal>
{/if}
