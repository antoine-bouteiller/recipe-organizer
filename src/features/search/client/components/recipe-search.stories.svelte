<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, userEvent, waitFor, within } from 'storybook/test'

  import { addRecentRecipe, clearRecentRecipes } from '@/stores/recent-recipes.store.svelte'
  import { resetShoppingList } from '@/stores/shopping-list.store.svelte'
  import type { ReducedRecipe } from '@/types/recipe'

  import RecipeSearch from './recipe-search.svelte'

  const recipes: ReducedRecipe[] = [
    {
      cuisineTypes: ['french'],
      id: 62_001,
      image: '',
      isMagimix: false,
      isSpice: false,
      isVegetarian: false,
      meals: ['dessert'],
      name: 'Crème brûlée',
      servings: 4,
    },
    {
      cuisineTypes: ['italian'],
      id: 62_002,
      image: '',
      isMagimix: false,
      isSpice: false,
      isVegetarian: true,
      meals: ['diner'],
      name: 'Pâtes au pesto',
      servings: 2,
    },
    { cuisineTypes: [], id: 62_003, image: '', isMagimix: false, isSpice: true, isVegetarian: true, meals: [], name: 'Mélange épices', servings: 1 },
  ]
  const { Story } = defineMeta({ args: { recipes }, component: RecipeSearch, parameters: { layout: 'padded' }, title: 'Search/RecipeSearch' })
</script>

<Story
  name="VC-2 Controlled Filters And Shopping Selection"
  tags={['!dev']}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)
    resetShoppingList()
    clearRecentRecipes()
    try {
      const input = canvas.getByRole('textbox', { name: 'Rechercher une recette, un ingrédient…' })
      await userEvent.type(input, 'creme')
      await expect(canvas.getByText('1 résultat')).toBeVisible()
      await expect(canvas.getByRole('link', { name: /Crème brûlée/ })).toHaveAttribute('href', '/recipe/62001')
      await expect(canvas.queryByRole('link', { name: /Pâtes au pesto/ })).not.toBeInTheDocument()
      await userEvent.click(canvas.getByRole('button', { name: 'Ajouter à la liste' }))
      await waitFor(() => expect(canvas.queryByRole('button', { name: 'Ajouter à la liste' })).not.toBeInTheDocument())
      await expect(JSON.parse(localStorage.getItem('shopping-list') ?? 'null')).toEqual([62001])
      await userEvent.clear(input)
      await userEvent.click(canvas.getByRole('button', { name: 'Filtrer par catégorie' }))
      await userEvent.click(canvas.getByRole('button', { name: 'Cuisines' }))
      await userEvent.click(await body.findByRole('button', { name: 'Italien' }))
      await expect(canvas.getByRole('link', { name: /Pâtes au pesto/ })).toBeVisible()
      await expect(canvas.queryByRole('link', { name: /Crème brûlée/ })).not.toBeInTheDocument()
      await userEvent.click(canvas.getByRole('button', { name: 'Magimix' }))
      await expect(canvas.getByText('Aucune recette ne correspond à votre recherche.')).toBeVisible()
      await userEvent.click(canvas.getByRole('button', { name: 'Effacer les filtres' }))
      await expect(input).toHaveValue('')
      await expect(canvas.getByRole('button', { name: 'Cuisines' })).toBeVisible()
      await expect(canvas.getByRole('button', { name: 'Magimix' })).toHaveAttribute('aria-pressed', 'false')
      await expect(canvas.getAllByRole('link')).toHaveLength(2)
    } finally {
      resetShoppingList()
      clearRecentRecipes()
    }
  }}
/>

<Story
  name="VC-5 Recent IDs And Clear History"
  tags={['!dev']}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    clearRecentRecipes()
    try {
      addRecentRecipe(62001)
      addRecentRecipe(62002)
      addRecentRecipe(62999)
      await expect(await canvas.findByRole('heading', { name: 'Recherches récentes' })).toBeVisible()
      await expect(canvas.getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual(['/recipe/62002', '/recipe/62001'])
      await userEvent.click(canvas.getByRole('button', { name: 'Effacer' }))
      await expect(canvas.queryByRole('heading', { name: 'Recherches récentes' })).not.toBeInTheDocument()
      await expect(canvas.getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual(['/recipe/62001', '/recipe/62002'])
      await expect(JSON.parse(localStorage.getItem('recent-recipes') ?? 'null')).toEqual([])
    } finally {
      clearRecentRecipes()
    }
  }}
/>

<Story
  name="VC-5 Recipe Link Records Recent ID"
  tags={['!dev']}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Keep Storybook on the canvas; the real Link's onclick still records the visit.
    const preventNavigation = (event: MouseEvent) => event.preventDefault()
    canvasElement.addEventListener('click', preventNavigation, true)
    clearRecentRecipes()
    try {
      await userEvent.click(canvas.getByRole('link', { name: /Pâtes au pesto/ }))
      await expect(await canvas.findByRole('heading', { name: 'Recherches récentes' })).toBeVisible()
      await expect(canvas.getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual(['/recipe/62002'])
      await expect(JSON.parse(localStorage.getItem('recent-recipes') ?? 'null')).toEqual([62002])
    } finally {
      canvasElement.removeEventListener('click', preventNavigation, true)
      clearRecentRecipes()
    }
  }}
/>
