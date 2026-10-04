<script lang="ts">
  import type { Snippet } from 'svelte'

  import type { IconProps } from './icon-types'

  /** Private SVG root. It deliberately forwards only the closed public icon contract. */
  const { 'aria-hidden': ariaHidden, 'aria-label': ariaLabel, children, size = 'inherit' }: IconProps & { children: Snippet } = $props()
</script>

<svg
  aria-hidden={ariaLabel === undefined ? (ariaHidden ?? true) : undefined}
  aria-label={ariaLabel}
  class={{
    element: size === 'inherit',
    large: size === 'lg',
    medium: size === 'md',
    small: size === 'sm',
    'extra-large': size === 'xl',
    'extra-small': size === 'xs',
  }}
  fill="none"
  height="1em"
  role={ariaLabel === undefined ? undefined : 'img'}
  viewBox="0 0 24 24"
  width="1em"
  xmlns="http://www.w3.org/2000/svg"
>
  {@render children()}
</svg>

<style>
  .element {
    color: currentColor;
    flex-shrink: 0;
    height: var(--owner-icon-size, 1em);
    margin-inline: var(--owner-icon-margin-inline, 0px);
    opacity: var(--owner-icon-opacity, 1);
    width: var(--owner-icon-size, 1em);
  }

  .large {
    color: currentColor;
    flex-shrink: 0;
    height: var(--owner-icon-size, 20px);
    margin-inline: var(--owner-icon-margin-inline, 0px);
    opacity: var(--owner-icon-opacity, 1);
    width: var(--owner-icon-size, 20px);
  }

  .medium {
    color: currentColor;
    flex-shrink: 0;
    height: var(--owner-icon-size, 18px);
    margin-inline: var(--owner-icon-margin-inline, 0px);
    opacity: var(--owner-icon-opacity, 1);
    width: var(--owner-icon-size, 18px);
  }

  .small {
    color: currentColor;
    flex-shrink: 0;
    height: var(--owner-icon-size, 16px);
    margin-inline: var(--owner-icon-margin-inline, 0px);
    opacity: var(--owner-icon-opacity, 1);
    width: var(--owner-icon-size, 16px);
  }

  .extra-large {
    color: currentColor;
    flex-shrink: 0;
    height: var(--owner-icon-size, 28px);
    margin-inline: var(--owner-icon-margin-inline, 0px);
    opacity: var(--owner-icon-opacity, 1);
    width: var(--owner-icon-size, 28px);
  }

  .extra-small {
    color: currentColor;
    flex-shrink: 0;
    height: var(--owner-icon-size, 12px);
    margin-inline: var(--owner-icon-margin-inline, 0px);
    opacity: var(--owner-icon-opacity, 1);
    width: var(--owner-icon-size, 12px);
  }
</style>
