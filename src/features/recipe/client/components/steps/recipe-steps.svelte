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

  const { stepGroups, subrecipes }: { readonly stepGroups: readonly RecipeStepGroup[]; readonly subrecipes: readonly SubrecipeInstructions[] } =
    $props()
</script>

{#snippet stepList(steps: readonly RecipeStep[])}
  {#if steps.length > 0}
    <ol class="recipe-steps-list">
      {#each steps as step}
        <li class="recipe-steps-step">
          <p class="recipe-steps-text">
            {#each parseBoldText(step.text) as segment}{#if segment.bold}<strong>{segment.text}</strong>{:else}{segment.text}{/if}{/each}
          </p>
          {#if step.magimix}<div class="recipe-steps-magimix"><MagimixStepItem {...step.magimix} /></div>{/if}
        </li>
      {/each}
    </ol>
  {/if}
{/snippet}
<div class="recipe-steps-groups">
  {#each stepGroups as group}
    {#if group.kind === 'steps'}
      {#if group.steps.length > 0}
        <div>
          {#if group.groupName}<strong class="recipe-steps-group-name">{group.groupName}</strong>{/if}{@render stepList(group.steps)}
        </div>
      {/if}
    {:else}
      {@const source = subrecipes.find((source) => source.id === group.recipeId)}
      {#if source && source.steps.length > 0}<div>
          <strong class="recipe-steps-group-name">{source.name}</strong>{@render stepList(source.steps)}
        </div>{/if}
    {/if}
  {/each}
</div>

<style>
  .recipe-steps-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    list-style-type: decimal;
    max-width: 65ch;
    padding-inline-start: 24px;
    width: 100%;
  }

  .recipe-steps-step {
    font-size: var(--font-sizes-sm);
    line-height: 24px;
    padding-inline-start: 4px;
  }

  .recipe-steps-step::marker {
    color: var(--colors-muted-foreground);
    font-weight: var(--font-weights-semibold);
  }

  .recipe-steps-text {
    white-space: pre-line;
  }

  .recipe-steps-magimix {
    margin-top: 8px;
  }

  .recipe-steps-groups {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .recipe-steps-group-name {
    display: block;
    margin-bottom: 8px;
  }
</style>
