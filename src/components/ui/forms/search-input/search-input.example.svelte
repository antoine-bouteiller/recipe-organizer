<script lang="ts">
  import SearchInput from './search-input.svelte'

  import * as styles from './search-input.stories.css'

  const { custom = false }: { custom?: boolean } = $props()
  let search = $state('')
</script>

{#if custom}
  <label class={styles.customPlaceholderField}
    ><span>Search ingredients</span><SearchInput placeholder="Search ingredients…" {search} setSearch={(next) => (search = next)} /></label
  >
{:else}
  <div class={styles.container}>
    <label class={styles.label}><span>Search recipes</span><SearchInput {search} setSearch={(next) => (search = next)} /></label>
    <p role="status">{search ? `Searching for ${search}` : 'Enter a recipe or ingredient'}</p>
  </div>
{/if}
