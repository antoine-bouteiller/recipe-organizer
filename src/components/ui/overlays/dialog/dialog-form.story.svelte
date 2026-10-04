<script lang="ts">
  import type { Snippet } from 'svelte'

  import Button from '@/components/ui/actions/button/button.svelte'

  import { provideDialogFormFrame } from './dialog-form.private.svelte'
  import Dialog from './dialog.svelte'

  let open = $state(false)
  let updated = $state(false)
  let saved = $state('')
  let outerSubmitted = $state(false)
  provideDialogFormFrame(() => ({ wrap: updated ? refreshedFrame : initialFrame }))
  const submit = (event: SubmitEvent, prefix: string) => {
    event.preventDefault()
    event.stopPropagation()
    const form = event.currentTarget
    if (!(form instanceof HTMLFormElement)) {
      return
    }
    saved = `${prefix}: ${new FormData(form).get('name')}`
    open = false
  }
</script>

{#snippet initialFrame(content: Snippet)}
  <form novalidate onsubmit={(event) => submit(event, 'Initial')}>{@render content()}</form>
{/snippet}
{#snippet refreshedFrame(content: Snippet)}
  <form novalidate onsubmit={(event) => submit(event, 'Updated')}>{@render content()}</form>
{/snippet}

<form
  onsubmit={(event) => {
    event.preventDefault()
    outerSubmitted = true
  }}
>
  <Dialog title="Nested recipe form" {open} onOpenChange={(next) => (open = next)} cancelLabel="Cancel">
    {#snippet renderTrigger(props)}<Button {...props} type="button">Edit nested form</Button>{/snippet}
    <label>Recipe name <input name="name" /></label>
    <Button type="button" onclick={() => (updated = true)}>Refresh form values</Button>
    {#snippet footer()}<Button type="submit">Save recipe</Button>{/snippet}
  </Dialog>
</form>
{#if saved}<p role="status">{saved}</p>{/if}
{#if outerSubmitted}<p role="alert">The outer form submitted.</p>{/if}
