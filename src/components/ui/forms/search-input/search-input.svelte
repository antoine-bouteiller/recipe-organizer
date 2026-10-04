<script lang="ts">
  import { onMount } from 'svelte'

  import { MagnifyingGlassIcon } from '@/components/ui/data-display/icons/svelte'

  import * as styles from './search-input.css'

  const {
    autoFocus,
    placeholder = 'Rechercher…',
    search,
    setSearch,
  }: { autoFocus?: boolean; placeholder?: string; search: string; setSearch: (value: string) => void } = $props()
  let input: HTMLInputElement | undefined = undefined
  onMount(() => {
    if (autoFocus) {
      input?.focus()
    }
  })
</script>

<div class={styles.root} data-slot="input-group" role="group">
  <input
    aria-label={placeholder}
    bind:this={input}
    class={styles.input}
    data-slot="input"
    oninput={(event) => setSearch(event.currentTarget.value)}
    {placeholder}
    value={search}
  />
  <div
    class={styles.addon}
    data-slot="input-group-addon"
    aria-hidden="true"
    onmousedown={(event) => {
      event.preventDefault()
      input?.focus()
    }}
  >
    <span class={styles.text}><MagnifyingGlassIcon /></span>
  </div>
</div>
