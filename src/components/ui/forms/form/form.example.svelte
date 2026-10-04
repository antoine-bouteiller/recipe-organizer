<script lang="ts">
  import Button from '@/components/ui/actions/button/button.svelte'

  import FieldError from '../field/field-error.svelte'
  import FieldLabel from '../field/field-label.svelte'
  import Field from '../field/field.svelte'
  import Input from '../input/input.svelte'
  import Form from './form.svelte'

  let submitted = $state(false)
  let recipeName = $state('')
  let errors = $state<Record<string, string>>({})
</script>

<Form
  {errors}
  onsubmit={(event) => {
    event.preventDefault()
    errors = recipeName ? {} : { recipeName: 'A recipe name is required.' }
    submitted = Boolean(recipeName)
  }}
>
  <Field name="recipeName"
    ><FieldLabel for="recipeName">Recipe name</FieldLabel><Input
      id="recipeName"
      oninput={(event) => (recipeName = event.currentTarget.value)}
      value={recipeName}
    /><FieldError /></Field
  >
  <Button type="submit">Save recipe</Button>
  {#if submitted}<p role="status">Recipe saved.</p>{/if}
</Form>
