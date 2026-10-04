<script lang="ts">
  import type { persistedStore } from './persisted-store.svelte'

  const reader: { store: ReturnType<typeof persistedStore<number[]>>; label: string } = $props()
  // oxlint-disable-next-line capitalized-comments -- Svelte directives are case-sensitive; this reader owns one store per mount.
  // svelte-ignore state_referenced_locally
  const selections = reader.store.useValue()
  const beforeMount = JSON.stringify(selections.current)
</script>

<p>{reader.label} before mount: {beforeMount}</p>
<p>{reader.label} selections: {JSON.stringify(selections.current)}</p>
<button type="button" onclick={() => reader.store.setState((ids) => [...ids, 5])}>Add selection to {reader.label}</button>
