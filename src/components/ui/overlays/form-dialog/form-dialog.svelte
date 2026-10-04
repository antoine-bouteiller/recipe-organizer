<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLFormAttributes } from 'svelte/elements'

  import type { DialogProps } from '../dialog/dialog.svelte'

  export type FormDialogProps = Pick<HTMLFormAttributes, 'action' | 'onsubmit'> & {
    children: Snippet
    errors?: Record<string, string>
    pending: boolean
    open: boolean
    setOpen: (open: boolean) => void
    submitLabel: string
    title: string
    renderTrigger?: DialogProps['renderTrigger']
  }
</script>

<script lang="ts">
  import FormSubmit from '@/components/ui/forms/form-submit/form-submit.svelte'
  import FormErrors from '@/components/ui/forms/form/form-errors.svelte'

  import { provideDialogFormFrame } from '../dialog/dialog-form.private.svelte'
  import Dialog from '../dialog/dialog.svelte'

  const { children, errors, pending, action, onsubmit, open, setOpen, submitLabel, title, renderTrigger }: FormDialogProps = $props()
  provideDialogFormFrame(() => ({ wrap }))
</script>

{#snippet wrap(content: Snippet)}
  <form
    {action}
    class="form"
    novalidate
    onsubmit={(event) => {
      event.stopPropagation()
      if (pending) {
        event.preventDefault()
        return
      }
      onsubmit?.(event)
    }}
  >
    <FormErrors {errors}>{@render content()}</FormErrors>
  </form>
{/snippet}
<Dialog cancelDisabled={pending} cancelLabel="Annuler" onOpenChange={setOpen} {open} {title} {renderTrigger}>
  {#snippet footer()}<FormSubmit label={submitLabel} {pending} />{/snippet}
  <div class="fields">{@render children()}</div>
</Dialog>

<style>
  .form {
    display: contents;
  }

  .fields {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
</style>
