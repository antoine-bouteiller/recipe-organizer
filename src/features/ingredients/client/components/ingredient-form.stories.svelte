<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, userEvent, within } from 'storybook/test'

  import Example from './ingredient-form.example.svelte'

  const { Story } = defineMeta({ component: Example, title: 'Features/Ingredients/IngredientForm' })
</script>

<Story name="Default" asChild><Example /></Story>
<Story
  name="VC-4 Mounted Catalogue Refresh"
  asChild
  tags={['!dev']}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)
    await userEvent.click(canvas.getByRole('button', { name: 'Ingrédient parent Aucune' }))
    await expect(await body.findByRole('button', { name: 'Tomate' })).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await userEvent.click(canvas.getByRole('button', { name: 'Actualiser le catalogue' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Ingrédient parent Aucune' }))
    await userEvent.click(await body.findByRole('button', { name: 'Courgette' }))
    await expect(canvas.getByRole('button', { name: 'Ingrédient parent Courgette' })).toBeVisible()
  }}><Example /></Story
>
