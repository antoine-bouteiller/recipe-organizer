<script lang="ts">
  import type { Snippet } from 'svelte'

  import type { IconProps, IconSize } from './icon-types'

  import * as styles from './icon.css'

  const iconRecipes = {
    inherit: styles.element,
    lg: styles.large,
    md: styles.medium,
    sm: styles.small,
    xl: styles.extraLarge,
    xs: styles.extraSmall,
  } satisfies Record<IconSize, string>

  /** Private SVG root. It deliberately forwards only the closed public icon contract. */
  const { 'aria-hidden': ariaHidden, 'aria-label': ariaLabel, children, size = 'inherit' }: IconProps & { children: Snippet } = $props()
</script>

<svg
  aria-hidden={ariaLabel === undefined ? (ariaHidden ?? true) : undefined}
  aria-label={ariaLabel}
  class={iconRecipes[size]}
  fill="none"
  height="1em"
  role={ariaLabel === undefined ? undefined : 'img'}
  viewBox="0 0 24 24"
  width="1em"
  xmlns="http://www.w3.org/2000/svg"
>
  {@render children()}
</svg>
