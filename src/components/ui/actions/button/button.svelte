<script lang="ts">
  import type { RecipeVariants } from '@vanilla-extract/recipes'
  import { Link } from '@void/svelte'
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  import * as styles from './button.css'

  type ButtonProps = Pick<HTMLButtonAttributes, 'aria-label' | 'disabled' | 'type'> &
    RecipeVariants<typeof styles.button> & { children?: Snippet } & (
      | { asLink: true; href: string; onclick?: never; ref?: never; viewTransition?: boolean }
      | ({ asLink?: false; href?: never; ref?: HTMLButtonElement; viewTransition?: never } & Pick<
          HTMLButtonAttributes,
          'aria-expanded' | 'aria-haspopup' | 'onclick' | 'onpointerdown'
        >)
    )

  let { align, asLink, children, href, ref = $bindable(), size, variant, viewTransition, width, ...rest }: ButtonProps = $props()
  const className = $derived(styles.button({ align, size, variant, width }))
</script>

{#if asLink && href !== undefined}
  <Link {...rest} class={className} {href} {viewTransition}>{@render children?.()}</Link>
{:else}
  <button {...rest} bind:this={ref} class={className}>{@render children?.()}</button>
{/if}
