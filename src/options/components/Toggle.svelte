<script>
  export let label = '';
  export let checked = false;
  export let onChange = () => {};
</script>

<label class="group relative mt-2 flex items-center justify-between p-2 text-lg text-ctp-text">
  <h4>{label}</h4>
  <input
    bind:checked={checked}
    on:change={onChange}
    type="checkbox"
    class="toggle-checkbox" />
  <span class="slider small"></span>
</label>
