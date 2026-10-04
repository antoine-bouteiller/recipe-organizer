<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, userEvent, waitFor, within } from 'storybook/test'

  import Example from './magimix-step-dialog.example.svelte'

  const { Story } = defineMeta({ component: Example, title: 'Recipe/MagimixStepDialog' })
  // Migration VC-3: reopening reads current edit values, not a cancelled draft or setup snapshot.
  const play = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)
    await userEvent.click(canvas.getByRole('button', { name: 'Modifier Magimix' }))
    let dialog = within(body.getByRole('dialog', { name: 'Modifier le programme Magimix' }))
    await expect(dialog.getByRole('textbox', { name: 'Minutes*' })).toHaveValue('2')
    await expect(dialog.getByRole('textbox', { name: 'Secondes*' })).toHaveValue('5')
    await userEvent.clear(dialog.getByRole('textbox', { name: 'Minutes*' }))
    await userEvent.type(dialog.getByRole('textbox', { name: 'Minutes*' }), '10')
    await userEvent.click(dialog.getByRole('button', { name: 'Annuler' }))
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument())
    await expect(canvas.getByRole('button', { name: 'Modifier Magimix' })).toHaveFocus()
    await userEvent.click(canvas.getByRole('button', { name: 'Actualiser le programme' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Modifier Magimix' }))
    dialog = within(body.getByRole('dialog', { name: 'Modifier le programme Magimix' }))
    await expect(dialog.getByRole('button', { name: 'Programme Vapeur' })).toBeVisible()
    await expect(dialog.getByRole('textbox', { name: 'Minutes*' })).toHaveValue('1')
    await expect(dialog.getByRole('textbox', { name: 'Secondes*' })).toHaveValue('30')
    await expect(dialog.getByRole('textbox', { name: 'Température (°C) - Optionnel' })).toHaveValue('')
    await userEvent.clear(dialog.getByRole('textbox', { name: 'Secondes*' }))
    await userEvent.type(dialog.getByRole('textbox', { name: 'Secondes*' }), '45')
    await userEvent.click(dialog.getByRole('button', { name: 'Enregistrer' }))
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument())
    await expect(JSON.parse(canvas.getByLabelText('Programme enregistré').textContent ?? '{}')).toEqual({
      program: 'steam',
      rotationSpeed: 'auto',
      time: 105,
    })
  }
</script>

<Story name="Current defaults on reopen (VC-3)" {play} />
