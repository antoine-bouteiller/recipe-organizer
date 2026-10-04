<script lang="ts">
  import SearchInput from './search-input.svelte'

  const { custom = false }: { custom?: boolean } = $props()
  let search = $state('')
</script>

{#if custom}
  <label class="custom-placeholder-field"
    ><span>Search ingredients</span><SearchInput placeholder="Search ingredients…" {search} setSearch={(next) => (search = next)} /></label
  >
{:else}
  <div class="container">
    <label class="label"><span>Search recipes</span><SearchInput {search} setSearch={(next) => (search = next)} /></label>
    <p role="status">{search ? `Searching for ${search}` : 'Enter a recipe or ingredient'}</p>
  </div>
{/if}

<style>
  .container {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .label {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .custom-placeholder-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
</style>
