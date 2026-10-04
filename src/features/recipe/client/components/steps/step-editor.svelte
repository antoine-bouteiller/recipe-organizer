<script lang="ts">
  import { onDestroy, tick } from 'svelte'

  import Button from '@/components/ui/actions/button/button.svelte'
  import { CaretDownIcon, CaretUpIcon, PlusIcon, TextBolderIcon, TrashIcon } from '@/components/ui/data-display/icons'
  import FieldError from '@/components/ui/forms/field/field-error.svelte'
  import Field from '@/components/ui/forms/field/field.svelte'
  import TextareaField from '@/components/ui/forms/textarea-field/textarea-field.svelte'
  import type { RecipeFormInput } from '@/features/recipe/schemas'

  import MagimixStepDialog from './magimix-step-dialog.svelte'
  import MagimixStepItem from './magimix-step-item.svelte'
  import { toggleBold } from './step-utils'

  type Step = Extract<NonNullable<RecipeFormInput['stepGroups']>[number], { kind: 'steps' }>['steps'][number]
  const {
    disabled,
    step,
    index,
    path,
    count,
    update,
    move,
    remove,
  }: {
    disabled: boolean
    step: Step
    index: number
    path: string
    count: number
    update: (step: Step) => void
    move: (offset: number) => void
    remove: () => void
  } = $props()
  let textarea = $state<HTMLTextAreaElement>()
  let disposed = false
  let selectionRevision = 0
  onDestroy(() => {
    disposed = true
    selectionRevision++
    textarea = undefined
  })
  const applyBold = async () => {
    const element = textarea
    if (!element || disabled) {
      return
    }
    const revision = ++selectionRevision
    const next = toggleBold({ end: element.selectionEnd, start: element.selectionStart, value: element.value })
    update({ ...step, text: next.value })
    await tick()
    if (disposed || revision !== selectionRevision || textarea !== element || !element.isConnected) {
      return
    }
    element.focus()
    element.setSelectionRange(next.start, next.end)
  }
</script>

<li class="steps-field-step">
  <span class="steps-field-number">{index + 1}.</span>
  <div class="steps-field-editor">
    <div class="steps-field-text-step">
      <TextareaField
        name={`${path}.text`}
        value={step.text}
        onChange={(value) => {
          selectionRevision++
          update({ ...step, text: value })
        }}
        aria-label={`Texte de l'étape ${index + 1}`}
        {disabled}
        onkeydown={(event) => {
          if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'b') {
            event.preventDefault()
            void applyBold()
          }
        }}
        placeholder="Décrivez l'étape"
        bind:ref={textarea}
      />
      <Button
        aria-label="Gras"
        {disabled}
        onclick={() => {
          void applyBold()
        }}
        size="icon-sm"
        type="button"
        variant="ghost"><TextBolderIcon size="sm" /></Button
      >
    </div>
    <Field name={`${path}.magimix`}>
      {#if step.magimix}
        <div class="steps-field-magimix-step">
          <MagimixStepDialog
            initialData={step.magimix}
            onSubmit={(value) => update({ ...step, magimix: value })}
            submitLabel="Enregistrer"
            title="Modifier le programme Magimix"
          >
            {#snippet renderTrigger(props)}<button {...props} class="steps-field-magimix-trigger" {disabled} type="button"
                >{#if step.magimix}<MagimixStepItem {...step.magimix} />{/if}</button
              >{/snippet}
          </MagimixStepDialog>
          <Button
            aria-label="Retirer le programme Magimix"
            {disabled}
            onclick={() => update({ ...step, magimix: undefined })}
            size="icon-sm"
            type="button"
            variant="destructive-ghost"><TrashIcon size="sm" /></Button
          >
        </div>
      {:else}
        <div class="steps-field-add-magimix">
          <MagimixStepDialog onSubmit={(value) => update({ ...step, magimix: value })} submitLabel="Ajouter" title="Ajouter un programme Magimix">
            {#snippet renderTrigger(props)}<Button {...props} {disabled} size="sm" type="button" variant="ghost"
                >Magimix <PlusIcon size="sm" /></Button
              >{/snippet}
          </MagimixStepDialog>
        </div>
      {/if}
      <FieldError />
    </Field>
  </div>
  <div class="steps-field-controls">
    <Button aria-label="Monter l'étape" disabled={disabled || index === 0} onclick={() => move(-1)} size="icon-sm" type="button" variant="ghost"
      ><CaretUpIcon size="sm" /></Button
    >
    <Button
      aria-label="Descendre l'étape"
      disabled={disabled || index === count - 1}
      onclick={() => move(1)}
      size="icon-sm"
      type="button"
      variant="ghost"><CaretDownIcon size="sm" /></Button
    >
    <Button aria-label="Supprimer l'étape" {disabled} onclick={remove} size="icon-sm" type="button" variant="destructive-ghost"
      ><TrashIcon size="sm" /></Button
    >
  </div>
</li>

<style>
  .steps-field-step {
    align-items: flex-start;
    display: flex;
    gap: 8px;
  }

  .steps-field-number {
    color: var(--colors-muted-foreground);
    font-size: var(--font-sizes-sm);
    font-weight: var(--font-weights-semibold);
    line-height: 34px;
    min-width: 24px;
  }

  .steps-field-editor {
    display: flex;
    flex: 1 1 0%;
    flex-direction: column;
    gap: 4px;
    min-width: 0px;
  }

  .steps-field-text-step {
    align-items: flex-start;
    display: flex;
    gap: 4px;
  }

  .steps-field-magimix-step {
    align-items: center;
    display: flex;
    gap: 4px;
  }

  .steps-field-magimix-trigger {
    cursor: pointer;
    text-align: start;
    width: 100%;
  }

  .steps-field-add-magimix {
    align-self: flex-start;
  }

  .steps-field-controls {
    display: flex;
    flex-shrink: 0;
  }
</style>
