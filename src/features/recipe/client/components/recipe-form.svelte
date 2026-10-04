<script module lang="ts">
  import type { Snippet } from 'svelte'

  import type { FileMetadata } from '@/hooks/use-file-upload.svelte'
  import type { Option } from '@/hooks/use-options.svelte'

  import type { RecipeFormState } from './recipe-form-state.svelte'

  export type { RecipeFormState } from './recipe-form-state.svelte'

  export interface RecipeFormProps {
    form: RecipeFormState
    initialImage?: FileMetadata
    initialVideo?: FileMetadata
    id?: number
    addNewIngredientOption?: Snippet<[string]>
    ingredientOptions: Option<number>[]
  }
</script>

<script lang="ts">
  import Button from '@/components/ui/actions/button/button.svelte'
  import { PlusIcon, TrashIcon } from '@/components/ui/data-display/icons/svelte'
  import ComboboxField from '@/components/ui/forms/combobox-field/combobox-field.svelte'
  import FieldError from '@/components/ui/forms/field/field-error.svelte'
  import Field from '@/components/ui/forms/field/field.svelte'
  import ImageField from '@/components/ui/forms/image-field/image-field.svelte'
  import Label from '@/components/ui/forms/label/label.svelte'
  import NumberField from '@/components/ui/forms/number-field/number-field.svelte'
  import SelectField from '@/components/ui/forms/select-field/select-field.svelte'
  import TextField from '@/components/ui/forms/text-field/text-field.svelte'
  import ToggleGroupField from '@/components/ui/forms/toggle-group-field/toggle-group-field.svelte'
  import VideoField from '@/components/ui/forms/video-field/video-field.svelte'
  import Separator from '@/components/ui/layout/separator/separator.svelte'
  import { CUISINE_TYPE_LABELS, CUISINE_TYPES, MEAL_LABELS, MEALS } from '@/features/recipe/constants'
  import { replaceAt, removeAt } from '@/utils/array'
  import { unitOptions } from '@/utils/units'

  import LinkedRecipesProvider from '../contexts/linked-recipes-provider.svelte'
  import { useRecipeOptions } from '../hooks/use-recipe-options.svelte'
  import StepsField from './steps/steps-field.svelte'

  import * as ingredientGroupStyles from './ingredient-group-field.css'
  import * as styles from './recipe-form.css'

  const { form, initialImage, initialVideo, id, addNewIngredientOption, ingredientOptions }: RecipeFormProps = $props()
  const data = $derived(form.data)
  const pending = $derived(form.pending)
  const linkedRecipes = $derived(data.linkedRecipes ?? [])
  const groups = $derived(data.ingredientGroups ?? [])
  const linkedRecipeIds = $derived(linkedRecipes.map((recipe) => recipe.id).filter((recipeId) => recipeId > 0))
  const recipeOptions = useRecipeOptions(() => ({ filter: (recipe) => recipe.id !== id }))
  const newKey = () => Math.random().toString(36).substring(7)
  const unitPickerItems = [{ label: 'Aucune', value: null }, ...unitOptions]
  const cuisineTypeItems = CUISINE_TYPES.map((value) => ({ label: CUISINE_TYPE_LABELS[value], value }))
  const mealItems = MEALS.map((value) => ({ label: MEAL_LABELS[value], value }))
</script>

<TextField name="name" value={data.name ?? ''} onChange={(value) => form.setData('name', value)} disabled={pending} label="Nom de la recette" />
<NumberField
  name="servings"
  value={data.servings}
  onChange={(value) => form.setData('servings', value)}
  disabled={pending}
  label="Portions"
  min={0}
/>
<ToggleGroupField
  name="meals"
  value={data.meals ?? []}
  onChange={(value) => form.setData('meals', value)}
  disabled={pending}
  items={mealItems}
  label="Repas"
/>
<ToggleGroupField
  name="cuisineTypes"
  value={data.cuisineTypes ?? []}
  onChange={(value) => form.setData('cuisineTypes', value)}
  disabled={pending}
  items={cuisineTypeItems}
  label="Cuisines"
/>
<div class={styles.container}>
  <Label>Sous-recettes liées</Label>
  <Field name="linkedRecipes">
    {#each linkedRecipes as linkedRecipe, index (linkedRecipe._key ?? linkedRecipe.id)}
      <div class={styles.linkedRecipeRow}>
        <div class={styles.linkedRecipeFields}>
          <div class={styles.linkedRecipeSelect}>
            <ComboboxField
              name={`linkedRecipes.${index}.id`}
              value={linkedRecipe.id}
              onChange={(value) => form.setData('linkedRecipes', replaceAt(linkedRecipes, index, { ...linkedRecipe, id: value ?? -1 }))}
              disabled={pending}
              options={recipeOptions.current}
              placeholder="Sélectionner une sous-recette"
              searchPlaceholder="Rechercher une sous-recette"
            />
          </div>
          <div class={styles.linkedRecipeRatio}>
            <NumberField
              name={`linkedRecipes.${index}.ratio`}
              value={Number.isNaN(linkedRecipe.ratio) ? undefined : linkedRecipe.ratio}
              onChange={(value) => form.setData('linkedRecipes', replaceAt(linkedRecipes, index, { ...linkedRecipe, ratio: value ?? Number.NaN }))}
              disabled={pending}
              min={0}
              placeholder="Ratio"
            />
          </div>
        </div>
        <Button
          aria-label="Supprimer la sous-recette liée"
          disabled={pending}
          onclick={() => form.setData('linkedRecipes', removeAt(linkedRecipes, index))}
          size="icon"
          type="button"
          variant="destructive-outline"><TrashIcon size="sm" /></Button
        >
      </div>
    {/each}
    <FieldError />
    <Button
      disabled={pending}
      onclick={() => form.setData('linkedRecipes', [...linkedRecipes, { _key: newKey(), id: -1, ratio: 1 }])}
      size="sm"
      type="button"
      variant="outline">Ajouter une sous-recette <PlusIcon size="sm" /></Button
    >
  </Field>
</div>
<ImageField
  name="image"
  value={data.image}
  onChange={(value) => form.setData('image', value)}
  disabled={pending}
  {initialImage}
  label="Photo de la recette"
/>
<VideoField
  name="video"
  value={data.video}
  onChange={(value) => form.setData('video', value)}
  disabled={pending}
  {initialVideo}
  label="Vidéo (optionnel)"
/>
<div class={styles.ingredientGroupsSection}>
  <Label>Groupes d'ingrédients</Label>
  <Field name="ingredientGroups">
    {#each groups as group, groupIndex (group._key)}
      {@const updateGroup = (value: typeof group) => form.setData('ingredientGroups', replaceAt(groups, groupIndex, value))}
      <div class={styles.ingredientGroupCard}>
        <Field name={`ingredientGroups.${groupIndex}`}>
          {#if groupIndex !== 0}
            <div class={styles.groupNameField}>
              <TextField
                name={`ingredientGroups.${groupIndex}.groupName`}
                value={group.groupName ?? ''}
                onChange={(value) => updateGroup({ ...group, groupName: value })}
                disabled={pending}
                label="Nom du groupe"
              />
            </div>
            <div class={styles.groupRemoveButton}>
              <Button
                aria-label="Supprimer le groupe d'ingrédients"
                disabled={pending}
                onclick={() => form.setData('ingredientGroups', removeAt(groups, groupIndex))}
                size="icon"
                type="button"
                variant="destructive-outline"><TrashIcon size="sm" /></Button
              >
            </div>
          {/if}
          <Field name={`ingredientGroups.${groupIndex}.ingredients`}>
            <div class={ingredientGroupStyles.container}>
              <Label>Ingrédients</Label>
              {#each group.ingredients as ingredient, ingredientIndex (ingredient._key)}
                {@const path = `ingredientGroups.${groupIndex}.ingredients.${ingredientIndex}`}
                {@const updateIngredient = (value: typeof ingredient) =>
                  updateGroup({ ...group, ingredients: replaceAt(group.ingredients, ingredientIndex, value) })}
                <div class={ingredientGroupStyles.ingredientRow}>
                  <div class={ingredientGroupStyles.ingredientFields}>
                    <ComboboxField
                      name={`${path}.id`}
                      value={ingredient.id}
                      onChange={(value) => updateIngredient({ ...ingredient, id: value ?? -1 })}
                      addNew={addNewIngredientOption}
                      disabled={pending}
                      options={ingredientOptions}
                      placeholder="Sélectionner un ingrédient"
                      searchPlaceholder="Rechercher un ingrédient"
                    />
                    <NumberField
                      name={`${path}.quantity`}
                      value={Number.isNaN(ingredient.quantity) ? undefined : ingredient.quantity}
                      onChange={(value) => updateIngredient({ ...ingredient, quantity: value ?? Number.NaN })}
                      disabled={pending}
                      min={0}
                      placeholder="Quantité"
                    />
                    <SelectField
                      name={`${path}.unitSlug`}
                      value={ingredient.unitSlug}
                      onChange={(value) => updateIngredient({ ...ingredient, unitSlug: unitOptions.find((option) => option.value === value)?.value })}
                      disabled={pending}
                      items={unitPickerItems}
                    />
                  </div>
                  <Button
                    aria-label="Supprimer l'ingrédient"
                    disabled={pending}
                    onclick={() => updateGroup({ ...group, ingredients: removeAt(group.ingredients, ingredientIndex) })}
                    size="icon"
                    type="button"
                    variant="destructive-outline"><TrashIcon size="sm" /></Button
                  >
                </div>
                <div class={ingredientGroupStyles.mobileSeparator}><Separator /></div>
              {/each}
              <FieldError />
              <Button
                aria-label="Ajouter un ingrédient"
                disabled={pending}
                onclick={() => updateGroup({ ...group, ingredients: [...group.ingredients, { _key: newKey(), id: -1, quantity: 0 }] })}
                size="sm"
                type="button"
                variant="outline"><PlusIcon size="sm" /></Button
              >
            </div>
          </Field>
          <FieldError />
        </Field>
      </div>
    {/each}
    <FieldError />
    <Button
      disabled={pending}
      onclick={() => form.setData('ingredientGroups', [...groups, { _key: newKey(), ingredients: [] }])}
      size="sm"
      type="button"
      variant="outline">Ajouter un groupe <PlusIcon size="sm" /></Button
    >
  </Field>
</div>
<LinkedRecipesProvider {linkedRecipeIds}><StepsField disabled={pending} {form} /></LinkedRecipesProvider>
