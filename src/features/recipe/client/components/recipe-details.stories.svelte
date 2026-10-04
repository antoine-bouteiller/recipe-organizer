<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, userEvent, within } from 'storybook/test'

  import { setRecipesQuantities } from '@/stores/recipe-quantities.store.svelte'

  import Example from './recipe-details.example.svelte'

  const { Story } = defineMeta({ component: Example, title: 'Recipe/RecipeDetails' })
  // Migration VC-5: serving overrides scale both own/linked ingredient displays,
  // Recipe replacement uses the new serving baseline without persisting an automatic override.
  const play = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    setRecipesQuantities(93_001, 4)
    await expect(canvas.getByText('Gâteau')).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Ajouter un couvert' }))
    await expect(canvas.getAllByText('125 g').at(0)).toBeInTheDocument()
    await expect(canvas.getAllByText('2.5').at(0)).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Changer de recette' }))
    await expect(canvas.getByText('Autre gâteau')).toBeInTheDocument()
    await expect(canvas.getAllByText('100 g').at(0)).toBeInTheDocument()
    await expect(JSON.parse(localStorage.getItem('recipe-quantities') ?? '{}')[93_002]).toBeUndefined()
    await userEvent.click(canvas.getByRole('button', { name: 'Changer de recette' }))
    await expect(canvas.getAllByText('125 g').at(0)).toBeInTheDocument()
  }
</script>

<Story name="Cooking quantities follow recipe (VC-5)" {play} />
<Story
  name="VC-3 Duplicate Linked Recipes Remain Readable"
  args={{ duplicateLinked: true }}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Gâteau')).toBeInTheDocument()
    await expect(canvas.getAllByText('Tomate')).toHaveLength(4)
  }}
/>
