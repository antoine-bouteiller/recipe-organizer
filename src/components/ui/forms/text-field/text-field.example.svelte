<script lang="ts">
  import { untrack } from 'svelte'

  import FormErrors from '../form/form-errors.svelte'
  import TextField from './text-field.svelte'

  const { disabled = false, initialValue = '', invalid = false }: { disabled?: boolean; initialValue?: string; invalid?: boolean } = $props()
  let value = $state<string>(untrack(() => initialValue))
</script>

<FormErrors errors={invalid ? { title: 'Invalid' } : {}}
  ><TextField name="title" {value} onChange={(next) => (value = next)} {disabled} label="Recipe title" placeholder="Tomato soup" /></FormErrors
>
