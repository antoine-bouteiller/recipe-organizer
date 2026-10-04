<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, userEvent, within } from 'storybook/test'

  import Example from './persisted-store.example.svelte'

  const { Story } = defineMeta({ component: Example, title: 'Client/PersistedStore' })
  // CT-5: actual component setup/mount, late readers, and persisted updates share one browser store.
  const hydration = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Saved before mount: [3]')).toBeVisible()
    await expect(canvas.getByText('First before mount: []')).toBeVisible()
    await expect(canvas.getByText('First selections: [3]')).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Mount another reader' }))
    await expect(canvas.getByText('Second before mount: []')).toBeVisible()
    await expect(canvas.getByText('Second selections: [3]')).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Add selection to First' }))
    await expect(canvas.getByText('First selections: [3,5]')).toBeVisible()
    await expect(canvas.getByText('Second selections: [3,5]')).toBeVisible()
    await expect(localStorage.getItem('persisted-store-selections-fixture')).toBe('[3,5]')
    await expect(canvas.getByText('Serving overrides: {}')).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Set serving override' }))
    await expect(canvas.getByText('Serving overrides: {"2":4}')).toBeVisible()
    await expect(localStorage.getItem('persisted-store-quantities-fixture')).toBe('{"2":4}')
  }
  const fallbackSelections = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('First selections: []')).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Add selection to First' }))
    await expect(canvas.getByText('First selections: [5]')).toBeVisible()
    await expect(localStorage.getItem('persisted-store-selections-fixture')).toBe('[5]')
  }
</script>

<Story name="Mount-time hydration and shared updates (VC-5)" play={hydration} />
<Story name="Missing saved selections use the initial value" args={{ savedSelections: null }} play={fallbackSelections} />
<Story name="Malformed saved selections use the initial value" args={{ savedSelections: '[1,' }} play={fallbackSelections} />
<Story
  name="Legacy saved selections use the initial value"
  args={{ savedSelections: '{"state":{"list":[1]},"version":0}' }}
  play={fallbackSelections}
/>
<Story
  name="Saved serving overrides hydrate and survive updates"
  args={{ savedQuantities: '{"3":6}' }}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Serving overrides: {"3":6}')).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Set serving override' }))
    await expect(canvas.getByText('Serving overrides: {"2":4,"3":6}')).toBeVisible()
    await expect(localStorage.getItem('persisted-store-quantities-fixture')).toBe('{"2":4,"3":6}')
  }}
/>
<Story
  name="Pre-mount writes preserve saved selections (VC-5)"
  args={{ earlyWrite: true }}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Saved before mount: [3]')).toBeVisible()
    await expect(canvas.getByText('First selections: [3]')).toBeVisible()
    await expect(localStorage.getItem('persisted-store-selections-fixture')).toBe('[3]')
  }}
/>
