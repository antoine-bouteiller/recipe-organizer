<script lang="ts">
  import QuantityControls from './quantity-controls.svelte'

  let id = $state(91_001)
</script>

<button type="button" onclick={() => (id = id === 91001 ? 91002 : 91001)}>Changer de recette</button>
<QuantityControls recipeId={id} servings={id === 91001 ? 4 : 2} variant="card" />
