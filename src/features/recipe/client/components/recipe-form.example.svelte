<script lang="ts">
  import Form from '@/components/ui/forms/form/form.svelte'
  import type { RecipeFormInput } from '@/features/recipe/schemas'

  import RecipeCatalogProvider from '../contexts/recipe-catalog-provider.svelte'
  import type { RecipeFormState } from './recipe-form-state.svelte'
  import RecipeForm from './recipe-form.svelte'

  let data = $state<RecipeFormInput>({
    cuisineTypes: [],
    image: { id: 'retained-image', url: '/magimix/expert.png' },
    ingredientGroups: [{ _key: 'base', ingredients: [{ _key: 'ingredient', id: 1, quantity: 100, unitSlug: 'g' }] }],
    linkedRecipes: [],
    meals: [],
    name: 'Recette existante',
    servings: 4,
    stepGroups: [{ _key: 'default', kind: 'steps', steps: [{ _key: 'step', text: 'Mélanger' }] }],
    video: { id: 'retained-video', url: '/recipe.mp4' },
  })
  let pending = $state(false)
  let options = $state([{ label: 'Farine', value: 1 }])
  const form: RecipeFormState = {
    get data() {
      return data
    },
    get pending() {
      return pending
    },
    setData: (key, value) => {
      data = { ...data, [key]: value }
    },
  }
  const recipes = [
    { cuisineTypes: [], id: 11, image: '', isMagimix: false, isSpice: false, isVegetarian: true, meals: [], name: 'Sauce tomate', servings: 4 },
  ]
</script>

<button
  type="button"
  onclick={() => {
    options = [...options, { label: 'Sel nouveau', value: 2 }]
  }}>Rafraîchir les ingrédients</button
>
<button
  type="button"
  onclick={() => {
    pending = !pending
  }}>Basculer en attente</button
>
<RecipeCatalogProvider {recipes}>
  <Form errors={{ 'ingredientGroups.1.ingredients.0.quantity': 'Quantité requise' }} onsubmit={(event) => event.preventDefault()}>
    <RecipeForm {form} ingredientOptions={options} />
    <output aria-label="Recette enregistrée">{JSON.stringify(data)}</output>
  </Form>
</RecipeCatalogProvider>
