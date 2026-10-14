<script lang="ts">
  import { createMutation, createQuery } from '@tanstack/svelte-query'
  import { untrack } from 'svelte'

  import NotFound from '@/components/not-found/not-found.svelte'
  import GoBackButton from '@/components/screen-layout/go-back-button.svelte'
  import ScreenLayout from '@/components/screen-layout/screen-layout.svelte'
  import Button from '@/components/ui/actions/button/button.svelte'
  import FormSubmit from '@/components/ui/forms/form-submit/form-submit.svelte'
  import Form from '@/components/ui/forms/form/form.svelte'
  import { ingredientListQuery } from '@/features/ingredients/client/api/get-all'
  import { renderAddIngredientOption } from '@/features/ingredients/client/components/add-ingredient.svelte'
  import { provideIngredientCatalog } from '@/features/ingredients/client/contexts/ingredient-catalog-context.svelte'
  import { useIngredientOptions } from '@/features/ingredients/client/hooks/use-ingredient-options.svelte'
  import { recipeListQuery } from '@/features/recipe/client/api/get-all'
  import { recipeDetailQuery } from '@/features/recipe/client/api/get-one'
  import type { Recipe, RecipeIngredientGroup } from '@/features/recipe/client/api/get-one'
  import { updateRecipeMutation } from '@/features/recipe/client/api/update'
  import RecipeFormActions from '@/features/recipe/client/components/recipe-form-actions.svelte'
  import type { RecipeFormState } from '@/features/recipe/client/components/recipe-form.svelte'
  import RecipeForm from '@/features/recipe/client/components/recipe-form.svelte'
  import { provideRecipeCatalog } from '@/features/recipe/client/contexts/recipe-catalog-context.svelte'
  import type { UpdateRecipeFormInput } from '@/features/recipe/schemas'
  import { alertError } from '@/lib/client/alert-error'
  import { createForm } from '@/lib/client/form.svelte'
  import { router } from '@/lib/client/router/router.svelte'
  import { getVideoUrl } from '@/utils/get-file-url'

  const { params }: { params: Record<string, string> } = $props()
  const id = untrack(() => Number(params.id))
  const detail = createQuery(() => recipeDetailQuery(id))
  const ingredients = createQuery(() => ingredientListQuery())
  const recipes = createQuery(() => recipeListQuery())
  provideIngredientCatalog(() => ingredients.data ?? [])
  provideRecipeCatalog(() => recipes.data ?? [])
  const ingredientOptions = useIngredientOptions()
  const mutation = createMutation(() => updateRecipeMutation(id))
  const recipe = $derived(detail.data?.recipe)

  const newKey = () => Math.random().toString(36).substring(7)
  const formatIngredientGroup = (group: RecipeIngredientGroup) => ({
    _key: newKey(),
    groupName: group.groupName ?? '',
    ingredients: group.groupIngredients.map((ingredient) => ({
      _key: newKey(),
      id: ingredient.ingredient.id,
      quantity: ingredient.quantity,
      unitSlug: ingredient.unitSlug ?? undefined,
    })),
  })
  const formatStepGroup = (group: Recipe['stepGroups'][number]) =>
    group.kind === 'steps'
      ? { ...group, _key: newKey(), steps: group.steps.map((step) => ({ ...step, _key: newKey() })) }
      : { ...group, _key: newKey() }
  const toFormValues = (source: Recipe): UpdateRecipeFormInput => ({
    cuisineTypes: source.cuisineTypes,
    id: source.id,
    image: { id: source.image, url: source.image },
    ingredientGroups: source.ingredientGroups.map(formatIngredientGroup),
    linkedRecipes: source.linkedRecipes.map((linkedRecipe) => ({ _key: newKey(), id: linkedRecipe.linkedRecipe.id, ratio: linkedRecipe.ratio })),
    meals: source.meals,
    name: source.name,
    servings: source.servings,
    stepGroups: source.stepGroups.map(formatStepGroup),
    video: source.video ? { id: source.video, url: getVideoUrl(source.video) } : undefined,
  })

  // The app remounts the screen per pathname, so the draft is seeded once per recipe.
  const initial = untrack(() => recipe)
  const form = createForm<UpdateRecipeFormInput>(initial ? toFormValues(initial) : {})
  const recipeForm: RecipeFormState = {
    get data() {
      return form.data
    },
    get pending() {
      return form.pending
    },
    setData: (key, value) => {
      form.data[key] = value
    },
  }

  const submit = async (event: SubmitEvent) => {
    event.preventDefault()
    if (form.pending || !recipe) {
      return
    }
    try {
      if (await form.submit((body) => mutation.mutateAsync(body))) {
        await router.navigate(`/recipe/${recipe.id}`, { replace: true })
      }
    } catch (error) {
      alertError(`Erreur lors de la mise à jour de la recette ${form.data.name ?? ''}`, error)
    }
  }
</script>

{#if recipe}
  <ScreenLayout title="Modifier la recette">
    <Form errors={form.errors} onsubmit={submit}>
      <RecipeForm
        addNewIngredientOption={renderAddIngredientOption}
        form={recipeForm}
        id={recipe.id}
        ingredientOptions={ingredientOptions.current}
        initialImage={{ id: recipe.image, url: recipe.image }}
        initialVideo={recipe.video ? { id: recipe.video, url: getVideoUrl(recipe.video) } : undefined}
      />
      <RecipeFormActions>
        <Button disabled={form.pending} onclick={() => history.back()} type="button" variant="outline">Annuler</Button>
        <FormSubmit pending={form.pending} label="Modifier la recette" />
      </RecipeFormActions>
    </Form>
    {#snippet backButton()}<GoBackButton />{/snippet}
  </ScreenLayout>
{:else if detail.isSuccess}
  <NotFound />
{/if}
