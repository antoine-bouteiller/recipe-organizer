<script module lang="ts">
  import StorySection from '@storybook-helpers/story-section.svelte'
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, screen, userEvent, waitFor, within } from 'storybook/test'

  import Example from './combobox-field.example.svelte'

  import * as styles from './combobox-field.stories.css'

  const { Story } = defineMeta({ component: Example, title: 'Forms/ComboboxField' })
  const play = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const trigger = within(within(canvasElement).getByRole('region', { name: 'Default' })).getByRole('button', {
      name: 'Meal Sélectionner une option',
    })
    // [VC-6] Naming must announce the field label and current selection, including clearing.
    await expect(trigger).toHaveAccessibleName('Meal Sélectionner une option')
    await userEvent.click(trigger)
    const search = await screen.findByPlaceholderText('Rechercher une option')
    await userEvent.type(search, 'lun')
    const popup = within(search.closest<HTMLElement>('[data-slot=popover-popup], [data-slot=drawer-popup]') ?? document.body)
    await expect(popup.queryByRole('button', { name: 'Dinner' })).not.toBeInTheDocument()
    await userEvent.click(popup.getByRole('button', { name: 'Lunch' }))
    await waitFor(() => expect(screen.queryByPlaceholderText('Rechercher une option')).not.toBeInTheDocument())
    await expect(trigger).toHaveAccessibleName('Meal Lunch')
    await userEvent.click(trigger)
    const reopenedSearch = await screen.findByPlaceholderText('Rechercher une option')
    const reopenedPopup = within(reopenedSearch.closest<HTMLElement>('[data-slot=popover-popup], [data-slot=drawer-popup]') ?? document.body)
    await userEvent.click(reopenedPopup.getByRole('button', { name: 'Lunch' }))
    await waitFor(() => expect(screen.queryByPlaceholderText('Rechercher une option')).not.toBeInTheDocument())
    await expect(trigger).toHaveAccessibleName('Meal Sélectionner une option')
  }
</script>

{#snippet overview()}
  <div class={styles.container}>
    <StorySection title="Default">
      <Example />
    </StorySection>
    <StorySection title="Initial Value">
      <Example initialValue="dinner" />
    </StorySection>
    <StorySection title="Invalid">
      <Example invalid />
    </StorySection>
    <StorySection title="Disabled">
      <Example disabled initialValue="breakfast" />
    </StorySection>
    <StorySection title="Empty">
      <Example options={[]} />
    </StorySection>
  </div>
{/snippet}
<Story name="Overview" asChild {play}>{@render overview()}</Story>
<Story name="Mobile" asChild {play} globals={{ viewport: { isRotated: false, value: 'mobile2' } }}>{@render overview()}</Story>
<Story
  name="Without Label"
  tags={['!dev']}
  args={{ label: '' }}
  play={async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Sélectionner une option' })
    // [VC-6] Without a field label, the value/placeholder remains the accessible name.
    await expect(trigger).toHaveAccessibleName('Sélectionner une option')
    await userEvent.click(trigger)
    const search = await screen.findByPlaceholderText('Rechercher une option')
    const popup = within(search.closest<HTMLElement>('[data-slot=popover-popup], [data-slot=drawer-popup]') ?? document.body)
    await userEvent.click(popup.getByRole('button', { name: 'Lunch' }))
    await waitFor(() => expect(screen.queryByPlaceholderText('Rechercher une option')).not.toBeInTheDocument())
    await expect(trigger).toHaveAccessibleName('Lunch')
  }}
/>
