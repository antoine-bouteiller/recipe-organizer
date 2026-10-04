<script lang="ts">
  import Button from '@/components/ui/actions/button/button.svelte'
  import Form from '@/components/ui/forms/form/form.svelte'
  import TextField from '@/components/ui/forms/text-field/text-field.svelte'

  import FormDialog from './form-dialog.svelte'

  import * as styles from './form-dialog.stories.css'

  const { regression = false, nested = false }: { regression?: boolean; nested?: boolean } = $props()
  let open = $state(false)
  let title = $state('Tomato soup')
  let pending = $state(false)
  let innerSubmits = $state(0)
  let outerSubmits = $state(0)
  let errors = $state<Record<string, string>>({})
  const complete = () => {
    pending = false
    open = false
  }
</script>

{#snippet editor()}
  <FormDialog
    {errors}
    {pending}
    onsubmit={(event) => {
      event.preventDefault()
      innerSubmits += 1
      if (nested && !title) {
        errors = { title: 'A title is required.' }
        return
      }
      errors = {}
      if (regression) pending = true
      else open = false
    }}
    {open}
    setOpen={(next) => (open = next)}
    submitLabel="Save recipe"
    title="Edit recipe"
  >
    {#snippet renderTrigger(props)}<Button {...props} type="button">Edit recipe</Button>{/snippet}
    <TextField name="title" value={title} onChange={(next) => (title = next)} label="Recipe title" />
    {#if regression}<div class={styles.container}>
        {#each Array.from({ length: 20 }, (_, index) => index) as index (index)}<p>Long form content {index + 1}</p>{/each}
      </div>
      <Button onclick={complete} type="button" variant="outline">Complete save</Button>{/if}
  </FormDialog>
{/snippet}
{#if nested}<Form
    onsubmit={(event) => {
      event.preventDefault()
      outerSubmits += 1
    }}>{@render editor()}<Button type="submit">Save outer</Button></Form
  >
  <p role="status">Inner: {innerSubmits}; outer: {outerSubmits}</p>{:else}{@render editor()}{/if}
