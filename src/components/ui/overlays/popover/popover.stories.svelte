<script module lang="ts">
  import StorySection from '@storybook-helpers/story-section.svelte'
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, userEvent, waitFor, within } from 'storybook/test'

  import Button from '@/components/ui/actions/button/button.svelte'

  import Dialog from '../dialog/dialog.svelte'
  import Popover from './popover.svelte'

  const { Story } = defineMeta({ component: Popover, title: 'Overlays/Popover' })
  const interaction = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)
    const trigger = canvas.getByRole('button', { name: 'Recipe actions' })
    await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(trigger)
    await waitFor(() => expect(body.getByRole('button', { name: 'Duplicate recipe' })).toBeVisible())
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await userEvent.click(document.body)
    await waitFor(() => expect(body.queryByRole('button', { name: 'Duplicate recipe' })).not.toBeInTheDocument())
    await expect(trigger).toHaveFocus()
    await userEvent.click(trigger)
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('button', { name: 'Duplicate recipe' })).not.toBeInTheDocument())
    await expect(trigger).toHaveFocus()
    await userEvent.click(trigger)
    await userEvent.click(trigger)
    await waitFor(() => expect(body.queryByRole('button', { name: 'Duplicate recipe' })).not.toBeInTheDocument())
  }
</script>

<script lang="ts">
  let controlledOpen = $state(true)
</script>

{#snippet overview()}
  <div class="story-layout">
    <StorySection title="Responsive">
      <Popover>
        {#snippet renderTrigger(props)}<Button {...props} variant="outline">Recipe actions</Button>{/snippet}
        <div class="container">
          <h2 class="heading">Recipe actions</h2>
          <Button variant="ghost">Duplicate recipe</Button>
          <Button variant="ghost">Archive recipe</Button>
        </div>
      </Popover>
    </StorySection>
  </div>
{/snippet}

<Story name="Overview" asChild play={interaction}>{@render overview()}</Story>
<Story name="Mobile" asChild globals={{ viewport: { isRotated: false, value: 'mobile2' } }} play={interaction}>{@render overview()}</Story>
<Story
  name="Nested Portal"
  asChild
  tags={['!dev']}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)
    const trigger = canvas.getByRole('button', { name: 'Open actions' })
    await userEvent.click(trigger)
    const nestedTrigger = await body.findByRole('button', { name: 'Open details' })
    await userEvent.click(nestedTrigger)
    const dialog = within(await body.findByRole('dialog', { name: 'Recipe details' }))
    await userEvent.click(dialog.getByRole('button', { name: 'Keep editing' }))
    await expect(body.getByRole('button', { name: 'Open details' })).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument())
    await expect(nestedTrigger).toHaveFocus()
    await expect(body.getByRole('button', { name: 'Open details' })).toBeVisible()
    await userEvent.click(document.body)
    await waitFor(() => expect(body.queryByRole('button', { name: 'Open details' })).not.toBeInTheDocument())
    await expect(trigger).toHaveFocus()
  }}
>
  <Popover>
    {#snippet renderTrigger(props)}<Button {...props}>Open actions</Button>{/snippet}
    <Dialog title="Recipe details">
      {#snippet renderTrigger(props)}<Button {...props}>Open details</Button>{/snippet}
      <Button>Keep editing</Button>
    </Dialog>
  </Popover>
</Story>

<Story
  name="Controlled"
  asChild
  tags={['!dev']}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)
    const trigger = canvas.getByRole('button', { name: 'Controlled actions' })
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await waitFor(() => expect(body.getByRole('button', { name: 'Controlled action' })).toBeVisible())
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('button', { name: 'Controlled action' })).not.toBeInTheDocument())
    await expect(trigger).toHaveFocus()
    await userEvent.click(trigger)
    await waitFor(() => expect(body.getByRole('button', { name: 'Controlled action' })).toBeVisible())
    await userEvent.click(document.body)
    await waitFor(() => expect(body.queryByRole('button', { name: 'Controlled action' })).not.toBeInTheDocument())
  }}
>
  <Popover open={controlledOpen} onOpenChange={(next) => (controlledOpen = next)}>
    {#snippet renderTrigger(props)}<Button {...props}>Controlled actions</Button>{/snippet}
    <Button>Controlled action</Button>
  </Popover>
</Story>

<style>
  .container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 224px;
  }

  .heading {
    font-weight: var(--font-weights-medium);
  }

  .story-layout {
    display: flex;
    flex-direction: column;
    gap: 32px;
    min-width: 0px;
    width: 100%;
  }
</style>
