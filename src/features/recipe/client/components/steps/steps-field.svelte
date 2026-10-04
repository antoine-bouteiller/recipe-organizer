<script lang="ts">
  import Button from '@/components/ui/actions/button/button.svelte'
  import { CaretDownIcon, CaretUpIcon, PlusIcon, TrashIcon } from '@/components/ui/data-display/icons/svelte'
  import ComboboxField from '@/components/ui/forms/combobox-field/combobox-field.svelte'
  import FieldError from '@/components/ui/forms/field/field-error.svelte'
  import Field from '@/components/ui/forms/field/field.svelte'
  import Label from '@/components/ui/forms/label/label.svelte'
  import TextField from '@/components/ui/forms/text-field/text-field.svelte'
  import { useLinkedRecipes } from '@/features/recipe/client/contexts/linked-recipes-context.svelte'
  import { useRecipeOptions } from '@/features/recipe/client/hooks/use-recipe-options.svelte'
  import { moveAt, removeAt, replaceAt } from '@/utils/array'

  import type { RecipeFormState } from '../recipe-form-state.svelte'
  import GroupSteps from './group-steps.svelte'

  import * as styles from './steps-field.css'

  const { disabled, form }: { disabled: boolean; form: RecipeFormState } = $props()
  const linkedRecipes = useLinkedRecipes()
  const subrecipeOptions = useRecipeOptions(() => ({ filter: (recipe) => linkedRecipes.current.includes(recipe.id) }))
  const groups = $derived(form.data.stepGroups ?? [])
  const setGroups = (value: typeof groups) => form.setData('stepGroups', value)
  const newKey = () => Math.random().toString(36).substring(7)
</script>

<div class={styles.container}>
  <Label>Étapes</Label>
  <Field name="stepGroups">
    {#each groups as group, groupIndex (group._key)}
      {@const update = (value: typeof group) => setGroups(replaceAt(groups, groupIndex, value))}
      <div class={styles.group}>
        {#if groupIndex > 0}
          <div class={styles.groupHeader}>
            <div class={styles.editor}>
              {#if group.kind === 'steps'}
                <TextField
                  name={`stepGroups.${groupIndex}.groupName`}
                  value={group.groupName ?? ''}
                  onChange={(value) => update({ ...group, groupName: value })}
                  {disabled}
                  label="Nom du groupe"
                />
              {:else}
                <ComboboxField
                  name={`stepGroups.${groupIndex}.recipeId`}
                  value={group.recipeId}
                  onChange={(value) => update({ ...group, recipeId: value ?? -1 })}
                  {disabled}
                  options={subrecipeOptions.current}
                  placeholder="Sélectionner une sous-recette liée"
                  searchPlaceholder="Rechercher une sous-recette"
                />
              {/if}
            </div>
            <div class={styles.controls}>
              <Button
                aria-label="Monter le groupe"
                disabled={disabled || groupIndex === 1}
                onclick={() => setGroups(moveAt(groups, groupIndex, groupIndex - 1))}
                size="icon-sm"
                type="button"
                variant="ghost"><CaretUpIcon size="sm" /></Button
              >
              <Button
                aria-label="Descendre le groupe"
                disabled={disabled || groupIndex === groups.length - 1}
                onclick={() => setGroups(moveAt(groups, groupIndex, groupIndex + 1))}
                size="icon-sm"
                type="button"
                variant="ghost"><CaretDownIcon size="sm" /></Button
              >
              <Button
                aria-label="Supprimer le groupe"
                {disabled}
                onclick={() => setGroups(removeAt(groups, groupIndex))}
                size="icon-sm"
                type="button"
                variant="destructive-ghost"><TrashIcon size="sm" /></Button
              >
            </div>
          </div>
        {/if}
        {#if group.kind === 'steps'}<GroupSteps {disabled} {group} {groupIndex} {update} />{/if}
      </div>
    {/each}
    <FieldError />
    <div class={styles.addActions}>
      <Button
        {disabled}
        onclick={() => setGroups([...groups, { _key: newKey(), kind: 'steps', steps: [] }])}
        size="sm"
        type="button"
        variant="outline">Groupe <PlusIcon size="sm" /></Button
      >
      <Button
        {disabled}
        onclick={() => setGroups([...groups, { _key: newKey(), kind: 'subrecipe', recipeId: linkedRecipes.current[0] ?? -1 }])}
        size="sm"
        type="button"
        variant="outline">Sous-recette <PlusIcon size="sm" /></Button
      >
    </div>
  </Field>
</div>
