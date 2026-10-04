<script module lang="ts">
  import type { RecipeStep } from '@/features/recipe/schemas'

  export interface SubrecipeInstructions {
    readonly id: number
    readonly name: string
    readonly steps: readonly RecipeStep[]
  }
</script>

<script lang="ts">
  import { parseBoldText } from '@/features/recipe/bold-text'
  import type { RecipeStepGroup } from '@/features/recipe/schemas'

  import MagimixStepItem from './magimix-step-item.svelte'

  import * as styles from './recipe-steps.css'

  const { stepGroups, subrecipes }: { readonly stepGroups: readonly RecipeStepGroup[]; readonly subrecipes: readonly SubrecipeInstructions[] } =
    $props()
</script>

{#snippet stepList(steps: readonly RecipeStep[])}
  {#if steps.length > 0}
    <ol class={styles.list}>
      {#each steps as step}
        <li class={styles.step}>
          <p class={styles.text}>
            {#each parseBoldText(step.text) as segment}{#if segment.bold}<strong>{segment.text}</strong>{:else}{segment.text}{/if}{/each}
          </p>
          {#if step.magimix}<div class={styles.magimix}><MagimixStepItem {...step.magimix} /></div>{/if}
        </li>
      {/each}
    </ol>
  {/if}
{/snippet}
<div class={styles.groups}>
  {#each stepGroups as group}
    {#if group.kind === 'steps'}
      {#if group.steps.length > 0}
        <div>
          {#if group.groupName}<strong class={styles.groupName}>{group.groupName}</strong>{/if}{@render stepList(group.steps)}
        </div>
      {/if}
    {:else}
      {@const source = subrecipes.find((source) => source.id === group.recipeId)}
      {#if source && source.steps.length > 0}<div><strong class={styles.groupName}>{source.name}</strong>{@render stepList(source.steps)}</div>{/if}
    {/if}
  {/each}
</div>
