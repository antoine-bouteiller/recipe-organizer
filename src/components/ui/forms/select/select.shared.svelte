<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  import { CaretUpDownIcon } from '@/components/ui/data-display/icons'
  import type { TriggerProps } from '@/hooks/use-drawer.svelte'

  type SelectButtonProps = TriggerProps &
    Pick<HTMLButtonAttributes, 'aria-invalid' | 'aria-describedby' | 'aria-labelledby' | 'disabled' | 'id' | 'aria-label'> & { children: Snippet }
  const { children, ...props }: SelectButtonProps = $props()
</script>

<button {...props} class="select-trigger" data-slot="select-button" type="button"
  ><span class="select-text">{@render children()}</span><span class="select-trigger-icon"><CaretUpDownIcon /></span></button
>

<style>
  .select-trigger {
    align-items: center;
    background-clip: padding-box;
    background-color: var(--colors-background);
    border-color: var(--colors-input);
    border-radius: var(--radius-lg);
    border-width: 1px;
    color: var(--colors-foreground);
    display: inline-flex;
    font-size: var(--font-sizes-base);
    gap: 8px;
    justify-content: space-between;
    min-height: 36px;
    min-width: 144px;
    outline: 2px solid transparent;
    outline-offset: 2px;
    padding-inline: 11px;
    position: relative;
    text-align: left;
    transition-duration: 150ms;
    transition-property: box-shadow;
    transition-timing-function: var(--easings-in-out);
    user-select: none;
    width: 100%;
    --owner-icon-opacity: 0.8;
    --owner-icon-size: 18px;
  }

  .select-trigger::before {
    border-radius: var(--radius-lg);
    content: '';
    inset: 0;
    pointer-events: none;
    position: absolute;
  }

  .select-trigger:focus-visible {
    border-color: var(--colors-ring);
    box-shadow: var(--shadows-ring);
  }

  .select-trigger:focus-visible[aria-invalid] {
    border-color: color-mix(in srgb, var(--colors-destructive) 64%, transparent);
    box-shadow: var(--shadows-invalid);
  }

  .select-trigger:not([data-disabled], :focus-visible, [aria-invalid], [data-pressed])::before {
    box-shadow: var(--shadows-edge);
  }

  .select-trigger[aria-invalid] {
    border-color: color-mix(in srgb, var(--colors-destructive) 36%, transparent);
    box-shadow: var(--shadows-none);
  }

  .select-trigger[data-disabled] {
    opacity: 0.64;
    pointer-events: none;
  }

  .select-trigger[data-pressed] {
    box-shadow: var(--shadows-none);
  }

  :global(.dark) .select-trigger {
    background-color: color-mix(in srgb, var(--colors-input) 32%, transparent);
  }

  :global(.dark) .select-trigger:focus-visible[aria-invalid] {
    box-shadow: var(--shadows-invalid);
  }

  @media (min-width: 640px) {
    .select-trigger {
      font-size: var(--font-sizes-sm);
      min-height: 32px;
      --owner-icon-size: 16px;
    }
  }

  @media (pointer: coarse) {
    .select-trigger::after {
      content: '';
      inset: 0;
      min-height: 44px;
      position: absolute;
    }
  }

  .select-trigger-icon {
    margin-inline-end: -4px;
    opacity: 0.8;
  }

  .select-text {
    flex: 1;
    overflow: hidden;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .select-trigger :global(svg) {
    flex-shrink: 0;
    pointer-events: none;
  }
</style>
