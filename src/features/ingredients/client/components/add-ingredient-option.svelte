<script lang="ts">
  import Button from '@/components/ui/actions/button/button.svelte'
  import { PlusIcon } from '@/components/ui/data-display/icons'

  import AddIngredient from './add-ingredient.svelte'

  const { inputValue }: { inputValue: string } = $props()
</script>

{#key inputValue}
  <AddIngredient defaultValue={inputValue}>
    {#snippet renderTrigger(props)}<Button {...props} size="sm" variant="list-action" width="full" align="start"
        ><PlusIcon aria-hidden="true" size="sm" />Nouvel ingrédient: {inputValue}</Button
      >{/snippet}
  </AddIngredient>
{/key}
