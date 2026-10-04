<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, userEvent, within } from 'storybook/test'

  import { removeFromShoppingList } from '@/stores/shopping-list.store.svelte'

  import Example from './recipe-list.example.svelte'

  const { Story } = defineMeta({ component: Example, title: 'Recipe/RecipeList' })
  // Recipe umbrella VC-3: card actions are independent of navigation, spice recipes stay excluded.
  const play = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    removeFromShoppingList(92_001)
    await expect(canvas.getByRole('link', { name: /Risotto/ })).toHaveAttribute('href', '/recipe/92001')
    await expect(canvas.queryByRole('link', { name: /Mélange d’épices/ })).not.toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Ajouter à la liste' }))
    await expect(canvas.getByText('4 couverts')).toBeVisible()
    await expect(canvas.getByRole('link', { name: 'Ajouter une recette' })).toHaveAttribute('href', '/recipe/new')
    removeFromShoppingList(92_001)
  }
  const empty = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Aucune recette')).toBeVisible()
    await expect(canvas.queryByRole('link')).not.toBeInTheDocument()
  }
</script>

<Story name="Cards and local action (VC-5)" {play} />
<Story name="Empty read-only list" args={{ canCreate: false, empty: true }} play={empty} />
