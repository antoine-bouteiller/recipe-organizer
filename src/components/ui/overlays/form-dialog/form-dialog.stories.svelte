<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, userEvent, waitFor, within } from 'storybook/test'

  import Example from './form-dialog.example.svelte'

  const { Story } = defineMeta({ component: Example, title: 'Overlays/FormDialog' })
</script>

<Story name="Default" asChild><Example /></Story>
<Story name="Mobile" asChild globals={{ viewport: { isRotated: false, value: 'mobile2' } }}><Example /></Story>
<Story
  name="Submit On Enter"
  asChild
  tags={['!dev']}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('button', { name: 'Edit recipe' }))
    const dialog = within(document.body)
    const field = await dialog.findByLabelText('Recipe title')
    await expect(field).toBeVisible()
    await userEvent.clear(field)
    await userEvent.type(field, 'Vegetable soup{Enter}')
    await waitFor(() => expect(dialog.queryByRole('dialog')).not.toBeInTheDocument())
  }}><Example /></Story
>
<Story
  name="Pending Dismissal Regression"
  asChild
  tags={['!dev']}
  globals={{ viewport: { isRotated: false, value: 'mobile1' } }}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('button', { expanded: false, name: 'Edit recipe' }))
    const dialog = within(document.body)
    await userEvent.click(await dialog.findByRole('button', { name: 'Save recipe' }))
    await waitFor(() => expect(dialog.getByRole('button', { name: 'Annuler' })).toBeDisabled())
    await userEvent.keyboard('{Escape}')
    await expect(dialog.getByRole('dialog')).toBeVisible()
    await userEvent.click(document.body)
    await expect(dialog.getByRole('dialog')).toBeVisible()
    await userEvent.click(dialog.getByRole('button', { name: 'Complete save' }))
    await waitFor(() => expect(dialog.queryByRole('dialog')).not.toBeInTheDocument())
    await userEvent.click(canvas.getByRole('button', { name: 'Edit recipe' }))
    await userEvent.click(dialog.getByLabelText('Recipe title'))
    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(dialog.getByRole('button', { name: 'Loading Save recipe' })).toBeDisabled())
    await userEvent.click(dialog.getByRole('button', { name: 'Complete save' }))
    await waitFor(() => expect(dialog.queryByRole('dialog')).not.toBeInTheDocument())
  }}><Example regression /></Story
>

<Story
  name="VC-6 Nested Form Ownership And Refreshed Errors"
  asChild
  tags={['!dev']}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)
    const trigger = canvas.getByRole('button', { name: 'Edit recipe' })
    await userEvent.click(trigger)
    const field = await body.findByRole('textbox', { name: 'Recipe title' })
    await expect(field).toBeVisible()
    await userEvent.clear(field)
    await userEvent.keyboard('{Enter}')
    await expect(body.getByRole('alert')).toHaveTextContent('A title is required.')
    await expect(field).toHaveAttribute('aria-invalid', 'true')
    await expect(canvas.getByRole('status')).toHaveTextContent('Inner: 1; outer: 0')
    await userEvent.type(field, 'New recipe{Enter}')
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument())
    await expect(canvas.getByRole('status')).toHaveTextContent('Inner: 2; outer: 0')
    await expect(trigger).toHaveFocus()
    await userEvent.click(trigger)
    await expect(await body.findByRole('textbox', { name: 'Recipe title' })).not.toHaveAttribute('aria-invalid')
    await userEvent.click(body.getByRole('button', { name: 'Annuler' }))
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument())
    await expect(canvas.getByRole('status')).toHaveTextContent('Inner: 2; outer: 0')
    await userEvent.click(canvas.getByRole('button', { name: 'Save outer' }))
    await expect(canvas.getByRole('status')).toHaveTextContent('Inner: 2; outer: 1')
  }}><Example nested /></Story
>
