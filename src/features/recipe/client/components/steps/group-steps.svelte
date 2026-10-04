<script lang="ts">
  import Button from '@/components/ui/actions/button/button.svelte'
  import { PlusIcon } from '@/components/ui/data-display/icons'
  import FieldError from '@/components/ui/forms/field/field-error.svelte'
  import Field from '@/components/ui/forms/field/field.svelte'
  import type { RecipeFormInput } from '@/features/recipe/schemas'
  import { moveAt, removeAt, replaceAt } from '@/utils/array'

  import StepEditor from './step-editor.svelte'

  import * as styles from './steps-field.css'

  type Group = Extract<NonNullable<RecipeFormInput['stepGroups']>[number], { kind: 'steps' }>
  const { disabled, group, groupIndex, update }: { disabled: boolean; group: Group; groupIndex: number; update: (group: Group) => void } = $props()
</script>

<Field name={`stepGroups.${groupIndex}.steps`}>
  <ol class={styles.list}>
    {#each group.steps as step, index (step._key)}
      <StepEditor
        {disabled}
        {step}
        {index}
        path={`stepGroups.${groupIndex}.steps.${index}`}
        count={group.steps.length}
        update={(value) => update({ ...group, steps: replaceAt(group.steps, index, value) })}
        move={(offset) => update({ ...group, steps: moveAt(group.steps, index, index + offset) })}
        remove={() => update({ ...group, steps: removeAt(group.steps, index) })}
      />
    {/each}
  </ol>
  <FieldError />
  <div class={styles.addActions}>
    <Button
      {disabled}
      onclick={() => update({ ...group, steps: [...group.steps, { _key: Math.random().toString(36).substring(7), text: '' }] })}
      size="sm"
      type="button"
      variant="outline">Étape <PlusIcon size="sm" /></Button
    >
  </div>
</Field>
