<script lang="ts">
  import type { Snippet } from 'svelte'

  interface BadgeProps {
    children?: Snippet
    size?: 'default' | 'sm'
    variant?: 'accent' | 'default' | 'secondary' | 'info-subtle' | 'destructive-subtle' | 'neutral-subtle' | 'success-subtle' | 'warning-subtle'
  }
  const { children, size = 'default', variant = 'default' }: BadgeProps = $props()
</script>

<span
  class={[
    'badge',
    {
      'size-default': size === 'default',
      'size-sm': size === 'sm',
      'variant-accent': variant === 'accent',
      'variant-default': variant === 'default',
      'variant-secondary': variant === 'secondary',
      'variant-info-subtle': variant === 'info-subtle',
      'variant-destructive-subtle': variant === 'destructive-subtle',
      'variant-neutral-subtle': variant === 'neutral-subtle',
      'variant-success-subtle': variant === 'success-subtle',
      'variant-warning-subtle': variant === 'warning-subtle',
    },
  ]}
  data-slot="badge">{@render children?.()}</span
>

<style>
  .badge {
    --owner-icon-size: 14px;
    align-items: center;
    border-color: transparent;
    border-radius: var(--radius-sm);
    border-width: 1px;
    display: inline-flex;
    flex-shrink: 0;
    font-weight: var(--font-weights-medium);
    gap: 4px;
    justify-content: center;
    outline: 2px solid transparent;
    outline-offset: 2px;
    position: relative;
    transition-duration: 150ms;
    transition-property: box-shadow;
    transition-timing-function: var(--easings-in-out);
    white-space: nowrap;
  }
  .badge:global([data-disabled]),
  .badge:disabled {
    opacity: 0.64;
    pointer-events: none;
  }
  .badge:is(:focus-visible, :global([data-focus-visible])) {
    outline: 2px solid var(--colors-ring);
    outline-offset: 1px;
  }
  .size-default {
    font-size: var(--font-sizes-sm);
    height: 22px;
    min-width: 22px;
    padding-inline: 3px;
  }
  .size-sm {
    border-radius: var(--radius-sm);
    font-size: var(--font-sizes-xs);
    height: 20px;
    min-width: 20px;
    padding-inline: 3px;
  }
  .variant-accent {
    background-color: var(--colors-accent);
    border-radius: var(--radius-full);
    color: var(--colors-accent-foreground);
    font-weight: var(--font-weights-semibold);
  }
  .variant-default {
    background-color: var(--colors-primary);
    color: var(--colors-primary-foreground);
  }
  .variant-secondary {
    background-color: var(--colors-secondary);
    color: var(--colors-secondary-foreground);
  }
  .variant-info-subtle {
    background-color: var(--colors-info-subtle);
    color: var(--colors-info-subtle-foreground);
  }
  .variant-destructive-subtle {
    background-color: var(--colors-destructive-subtle);
    color: var(--colors-destructive-subtle-foreground);
  }
  .variant-neutral-subtle {
    background-color: var(--colors-neutral-subtle);
    color: var(--colors-neutral-subtle-foreground);
  }
  .variant-success-subtle {
    background-color: var(--colors-success-subtle);
    color: var(--colors-success-subtle-foreground);
  }
  .variant-warning-subtle {
    background-color: var(--colors-warning-subtle);
    color: var(--colors-warning-subtle-foreground);
  }
  @media screen and (min-width: 640px) {
    .badge {
      --owner-icon-size: 12px;
    }
    .size-default {
      font-size: var(--font-sizes-xs);
      height: 18px;
      min-width: 18px;
    }
    .size-sm {
      font-size: var(--font-sizes-xs);
      height: 16px;
      min-width: 16px;
    }
  }
</style>
