<script lang="ts">
  import Button from '@/components/ui/actions/button/button.svelte'
  import type { MagimixProgramData } from '@/features/recipe/magimix'

  import MagimixStepDialog from './magimix-step-dialog.svelte'

  let program = $state<MagimixProgramData>({ program: 'expert', rotationSpeed: '3', temperature: 100, time: 125 })
</script>

<button
  type="button"
  onclick={() => {
    program = { program: 'steam', rotationSpeed: 'auto', time: 90 }
  }}>Actualiser le programme</button
>
<MagimixStepDialog
  initialData={program}
  onSubmit={(value) => {
    program = value
  }}
  submitLabel="Enregistrer"
  title="Modifier le programme Magimix"
>
  {#snippet renderTrigger(props)}<Button {...props}>Modifier Magimix</Button>{/snippet}
</MagimixStepDialog>
<output aria-label="Programme enregistré">{JSON.stringify(program)}</output>
