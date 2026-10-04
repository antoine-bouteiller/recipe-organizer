<script module lang="ts">
  import StorySection from '@storybook-helpers/story-section.svelte'
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, userEvent, within } from 'storybook/test'

  import Example from './toggle-group-field.example.svelte'

  import * as styles from './toggle-group-field.stories.css'

  const { Story } = defineMeta({ component: Example, title: 'Forms/ToggleGroupField' })
</script>

{#snippet overview()}
  <div class={styles.container}>
    <StorySection title="Default">
      <Example />
    </StorySection>
    <StorySection title="Initial Value">
      <Example initialValue={['lunch']} />
    </StorySection>
    <StorySection title="Disabled">
      <Example disabled initialValue={['lunch']} />
    </StorySection>
  </div>
{/snippet}
<Story name="Overview" asChild>{@render overview()}</Story>
<Story
  name="VC-6 Controlled Multi-Selection"
  asChild
  tags={['!dev']}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const enabled = within(canvas.getByRole('region', { name: 'Editable meals' }))
    const breakfast = enabled.getByRole('button', { name: 'Breakfast' })
    const lunch = enabled.getByRole('button', { name: 'Lunch' })
    const dinner = enabled.getByRole('button', { name: 'Dinner' })
    const value = enabled.getByRole('status', { name: 'Meals value' })

    await expect(value).toHaveTextContent(/^\["lunch"\]$/)
    await expect(lunch).toHaveAttribute('aria-pressed', 'true')
    await expect(breakfast).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(breakfast)
    await expect(value).toHaveTextContent(/^\["lunch","breakfast"\]$/)
    await expect(lunch).toHaveAttribute('aria-pressed', 'true')
    await expect(breakfast).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(dinner)
    await expect(value).toHaveTextContent(/^\["lunch","breakfast","dinner"\]$/)
    await expect(lunch).toHaveAttribute('aria-pressed', 'true')
    await expect(breakfast).toHaveAttribute('aria-pressed', 'true')
    await expect(dinner).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(breakfast)
    await expect(value).toHaveTextContent(/^\["lunch","dinner"\]$/)
    await expect(breakfast).toHaveAttribute('aria-pressed', 'false')
    await expect(lunch).toHaveAttribute('aria-pressed', 'true')
    await expect(dinner).toHaveAttribute('aria-pressed', 'true')

    const disabled = within(canvas.getByRole('region', { name: 'Disabled meals' }))
    const disabledLunch = disabled.getByRole('button', { name: 'Lunch' })
    const disabledBreakfast = disabled.getByRole('button', { name: 'Breakfast' })
    const disabledDinner = disabled.getByRole('button', { name: 'Dinner' })
    const disabledValue = disabled.getByRole('status', { name: 'Meals value' })
    await expect(disabledValue).toHaveTextContent(/^\["lunch","dinner"\]$/)
    await expect(disabledLunch).toBeDisabled()
    await expect(disabledBreakfast).toBeDisabled()
    await expect(disabledDinner).toBeDisabled()
    await userEvent.click(disabledLunch, { pointerEventsCheck: 0 })
    await userEvent.click(disabledBreakfast, { pointerEventsCheck: 0 })
    await expect(disabledValue).toHaveTextContent(/^\["lunch","dinner"\]$/)
    await expect(disabledLunch).toHaveAttribute('aria-pressed', 'true')
    await expect(disabledDinner).toHaveAttribute('aria-pressed', 'true')
    await expect(disabledBreakfast).toHaveAttribute('aria-pressed', 'false')
  }}
>
  <section aria-label="Editable meals"><Example initialValue={['lunch']} /></section>
  <section aria-label="Disabled meals"><Example disabled initialValue={['lunch', 'dinner']} /></section>
</Story>
