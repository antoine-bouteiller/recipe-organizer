<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, userEvent, within } from 'storybook/test'

  import Example from './ingredients-management.example.svelte'

  const { Story } = defineMeta({ component: Example, title: 'Features/Ingredients/IngredientsManagement' })
</script>

<Story name="Default" asChild><Example /></Story>
<Story
  name="VC-3 Catalogue Search Empty States And Authority"
  asChild
  tags={['!dev']}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: 'Ajouter un ingrédient' })).toBeVisible()
    await expect(canvas.queryByRole('button', { expanded: false, name: '' })).not.toBeInTheDocument()
    const search = canvas.getByRole('textbox', { name: 'Rechercher une recette, un ingrédient…' })
    await userEvent.type(search, ' FISH ')
    await expect(canvas.getByText('Saumon')).toBeVisible()
    await expect(canvas.queryByText('Tomate')).not.toBeInTheDocument()
    await userEvent.clear(search)
    await userEvent.type(search, 'introuvable')
    await expect(canvas.getByText('Aucun ingrédient trouvé pour cette recherche.')).toBeVisible()
    await userEvent.clear(search)
    await userEvent.click(canvas.getByRole('button', { name: 'Changer les permissions' }))
    await expect(canvas.getAllByRole('button', { expanded: false, name: '' })).toHaveLength(4)
    await userEvent.click(canvas.getByRole('button', { name: 'Vider le catalogue' }))
    await expect(canvas.getByText('Aucun ingrédient trouvé. Ajoutez-en un pour commencer.')).toBeVisible()
  }}><Example /></Story
>
