<script lang="ts">
  import Button from '@/components/ui/actions/button/button.svelte'

  import Form from '../form/form.svelte'
  import TextField from './text-field.svelte'

  let errors = $state<Record<string, string>>({})
  let name = $state('steps.0.title')
  let value = $state('Soup')
</script>

<Form {errors}>
  <TextField {name} {value} onChange={(next) => (value = next)} label="Step title" required />
  <Button type="button" onclick={() => (errors = { 'steps.0.title': 'First error', 'steps.1.title': 'Second error' })}>Validate</Button>
  <Button type="button" onclick={() => (name = 'steps.1.title')}>Next step</Button>
  <Button type="button" onclick={() => (errors = {})}>Clear errors</Button>
</Form>
