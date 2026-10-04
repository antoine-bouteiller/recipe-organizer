<script lang="ts">
  import { untrack } from 'svelte'
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  import { CheckIcon } from '@/components/ui/data-display/icons'

  type ToggleProps = Pick<HTMLButtonAttributes, 'aria-label' | 'disabled'> & {
    children?: Snippet
    defaultPressed?: boolean
    onPressedChange?: (pressed: boolean) => void
    presentation?: 'check-row' | 'default' | 'filter'
    pressed?: boolean
    variant?: 'default' | 'outline'
  }
  const {
    children,
    defaultPressed = false,
    onPressedChange,
    presentation = 'default',
    pressed: controlledPressed,
    variant = 'default',
    ...props
  }: ToggleProps = $props()
  let localPressed = $state(untrack(() => defaultPressed))
  const pressed = $derived(controlledPressed ?? localPressed)
</script>

<button
  {...props}
  aria-pressed={pressed}
  class={[
    'toggle',
    {
      'presentation-default': presentation === 'default',
      'presentation-filter': presentation === 'filter',
      'presentation-check-row': presentation === 'check-row',
      'variant-default': variant === 'default',
      'variant-outline': variant === 'outline',
    },
  ]}
  data-slot="toggle"
  onclick={() => {
    localPressed = !pressed
    onPressedChange?.(localPressed)
  }}
  type="button"
>
  {#if presentation === 'check-row'}
    <span aria-hidden="true" class="check" data-slot="toggle-check"><CheckIcon size="xs" weight="bold" /></span>
    <span class="check-row-content">{@render children?.()}</span>
  {:else}
    {@render children?.()}
  {/if}
</button>

<style>
  .check {
    --owner-icon-size: 12px;
    --owner-icon-margin-inline: 0px;
    --owner-icon-opacity: 0;
    align-items: center;
    border-color: color-mix(in srgb, var(--colors-muted-foreground) 40%, transparent);
    border-radius: var(--radius-full);
    border-width: 2px;
    display: flex;
    flex-shrink: 0;
    height: 22px;
    justify-content: center;
    width: 22px;
  }
  [data-slot='toggle'][aria-pressed='true'] > .check {
    --owner-icon-opacity: 1;
    background-color: var(--colors-primary);
    border-color: var(--colors-primary);
    color: var(--colors-primary-foreground);
  }

  .check-row-content {
    flex: 1;
  }
  [data-slot='toggle'][aria-pressed='true'] > .check-row-content {
    color: var(--colors-muted-foreground);
    text-decoration: line-through;
  }

  .toggle {
    --owner-icon-margin-inline: -2px;
    --owner-icon-opacity: 0.8;
    --owner-icon-size: 18px;
    align-items: center;
    border-radius: var(--radius-lg);
    border-width: 1px;
    cursor: pointer;
    display: inline-flex;
    font-size: var(--font-sizes-base);
    font-weight: var(--font-weights-medium);
    gap: 8px;
    height: 36px;
    justify-content: center;
    min-width: 36px;
    padding-inline: 7px;
    position: relative;
    -webkit-user-select: none;
    user-select: none;
    white-space: nowrap;
  }
  .toggle[aria-pressed='true'] {
    background-color: color-mix(in srgb, var(--colors-input) 64%, transparent);
    color: var(--colors-accent-foreground);
  }
  .toggle[data-disabled],
  .toggle:disabled {
    opacity: 0.64;
    pointer-events: none;
  }
  .toggle::after {
    content: '';
    display: none;
    inset: 0px;
    min-height: 44px;
    min-width: var(--toggle-hit-min-width, 44px);
    position: absolute;
  }
  .toggle:is(:focus-visible, [data-focus-visible]) {
    outline: 2px solid var(--colors-ring);
    outline-offset: 1px;
    z-index: 10;
  }
  .presentation-filter[aria-pressed='true'] {
    background-color: color-mix(in srgb, var(--colors-primary) 12%, transparent);
    border-color: var(--colors-primary);
    color: var(--colors-primary);
  }
  .presentation-check-row {
    border-color: var(--colors-border);
    border-width: 0;
    border-bottom-width: 1px;
    border-radius: var(--radius-none);
    font-size: var(--font-sizes-base);
    font-weight: var(--font-weights-normal);
    gap: 12px;
    height: auto;
    justify-content: flex-start;
    min-width: auto;
    padding-block: 12px;
    padding-inline: 0px;
    text-align: left;
    white-space: normal;
    width: 100%;
  }
  .presentation-check-row[aria-pressed='true'] {
    background-color: transparent;
    color: inherit;
  }
  .presentation-check-row:last-child {
    border-bottom-width: 0;
  }
  .variant-default {
    border-color: transparent;
  }
  .variant-outline {
    background-clip: padding-box;
    -webkit-background-clip: padding-box;
    background-color: var(--colors-background);
    border-color: var(--colors-input);
    box-shadow: var(--shadows-xs);
  }
  .variant-outline[aria-pressed='true'] {
    background-color: color-mix(in srgb, var(--colors-input) 64%, transparent);
  }
  :global(.dark) .variant-outline[aria-pressed='true'] {
    background-color: var(--colors-input);
  }
  :global(.dark) .variant-outline {
    background-color: color-mix(in srgb, var(--colors-input) 32%, transparent);
  }
  .variant-outline[data-disabled],
  .variant-outline:disabled {
    box-shadow: var(--shadows-none);
  }
  .variant-outline::before {
    content: '';
    border-radius: var(--radius-lg);
    box-shadow: var(--shadows-edge);
    inset: 0px;
    pointer-events: none;
    position: absolute;
  }
  .variant-outline:is(:active, [data-active]) {
    box-shadow: var(--shadows-none);
  }
  :where(.presentation-check-row).variant-default {
    border-color: var(--colors-border);
  }
  @media screen and (min-width: 640px) {
    .toggle {
      --owner-icon-size: 16px;
      font-size: var(--font-sizes-sm);
      height: 32px;
      min-width: 32px;
    }
    .presentation-check-row {
      font-size: var(--font-sizes-base);
      height: auto;
      min-width: auto;
    }
  }
  @media (pointer: coarse) {
    .toggle::after {
      display: block;
    }
  }
  @media (hover: hover) and (pointer: fine) {
    .toggle:hover {
      background-color: var(--colors-accent);
    }
    .presentation-check-row:hover {
      background-color: transparent;
    }
    :global(.dark) .variant-outline:hover {
      background-color: color-mix(in srgb, var(--colors-input) 64%, transparent);
    }
    .variant-outline:hover {
      background-color: var(--colors-accent);
    }
  }
</style>
