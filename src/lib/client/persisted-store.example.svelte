<script lang="ts">
  import Reader from './persisted-store.reader.svelte'
  import { persistedStore } from './persisted-store.svelte'

  const scenario: { earlyWrite?: boolean } = $props()
  const selectionsKey = 'persisted-store-selections-fixture'
  const quantitiesKey = 'persisted-store-quantities-fixture'
  localStorage.setItem(selectionsKey, '[1]')
  const selections = persistedStore<number[]>(selectionsKey, [])
  // The saved snapshot can change between module/store creation and actual client mount.
  localStorage.setItem(selectionsKey, '[3]')
  // oxlint-disable-next-line capitalized-comments -- Svelte directives are case-sensitive; this write deliberately happens only in setup.
  // svelte-ignore state_referenced_locally
  if (scenario.earlyWrite) {
    selections.setState(() => [])
  }
  const savedBeforeMount = localStorage.getItem(selectionsKey)
  localStorage.setItem(quantitiesKey, '[1]')
  const quantities = persistedStore<Record<number, number>>(quantitiesKey, {})
  const overrides = quantities.useValue()
  let anotherReader = $state(false)
</script>

<p>Saved before mount: {savedBeforeMount}</p>
<Reader store={selections} label="First" />
{#if anotherReader}
  <Reader store={selections} label="Second" />
{/if}
<button
  type="button"
  onclick={() => {
    localStorage.setItem(selectionsKey, '[99]')
    anotherReader = true
  }}>Mount another reader</button
>
<p>Serving overrides: {JSON.stringify(overrides.current)}</p>
<button type="button" onclick={() => quantities.setState((previous) => ({ ...previous, 2: 4 }))}>Set serving override</button>
