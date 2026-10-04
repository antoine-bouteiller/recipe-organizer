<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, userEvent, waitFor, within } from 'storybook/test'

  import Example from './edit-ingredient.example.svelte'

  const { Story } = defineMeta({ component: Example, title: 'Features/Ingredients/EditIngredient' })
</script>

<Story name="Default" asChild><Example /></Story>
<Story
  name="VC-3 VC-4 Edit Invalid Draft And Refreshed Row"
  asChild
  tags={['!dev']}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)
    const trigger = canvas.getByRole('button', { expanded: false })
    await userEvent.click(trigger)
    const name = await body.findByRole('textbox', { name: "Nom de l'ingrédient" })
    await expect(name).toHaveValue('Tomate')
    await expect(body.getByRole('button', { name: 'Ingrédient parent Aucune' })).toBeVisible()
    await userEvent.clear(name)
    await userEvent.type(name, 'x{Enter}')
    await expect(await body.findByRole('alert')).toHaveTextContent('Le nom doit comporter au moins 2 caractères')
    await userEvent.click(body.getByRole('button', { name: "Actualiser l'ingrédient" }))
    await expect(name).toHaveValue('x')
    await userEvent.clear(name)
    await userEvent.type(name, 'Sauce tomate{Enter}')
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument())
    await expect(canvas.getByRole('status')).toHaveTextContent('Ingrédient: Sauce tomate')
    await userEvent.click(trigger)
    await expect(await body.findByRole('textbox', { name: "Nom de l'ingrédient" })).toHaveValue('Sauce tomate')
    await expect(body.queryByRole('alert')).not.toBeInTheDocument()
    await userEvent.click(body.getByRole('button', { name: 'Annuler' }))
    await userEvent.click(canvas.getByRole('button', { name: "Actualiser l'ingrédient" }))
    await userEvent.click(trigger)
    await expect(await body.findByRole('textbox', { name: "Nom de l'ingrédient" })).toHaveValue('Courgette')
    await userEvent.click(body.getByRole('button', { name: 'Annuler' }))
  }}><Example /></Story
>
