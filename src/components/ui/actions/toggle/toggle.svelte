<script lang="ts">
  import { untrack } from 'svelte'
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  import { CheckIcon } from '@/components/ui/data-display/icons/svelte'

  import * as styles from './toggle.css'

  type ToggleProps = Pick<HTMLButtonAttributes, 'aria-label' | 'disabled'> & {
    children?: Snippet
    defaultPressed?: boolean
    onPressedChange?: (pressed: boolean) => void
    presentation?: 'check-row' | 'default' | 'filter'
    pressed?: boolean
    variant?: 'default' | 'outline'
  }
  const { children, defaultPressed = false, onPressedChange, presentation, pressed: controlledPressed, variant, ...props }: ToggleProps = $props()
  let localPressed = $state(untrack(() => defaultPressed))
  const pressed = $derived(controlledPressed ?? localPressed)
</script>

<button
  {...props}
  aria-pressed={pressed}
  class={styles.toggle({ presentation, variant })}
  data-slot="toggle"
  onclick={() => {
    localPressed = !pressed
    onPressedChange?.(localPressed)
  }}
  type="button"
>
  {#if presentation === 'check-row'}
    <span aria-hidden="true" class={styles.check} data-slot="toggle-check"><CheckIcon size="xs" weight="bold" /></span>
    <span class={styles.checkRowContent}>{@render children?.()}</span>
  {:else}
    {@render children?.()}
  {/if}
</button>
