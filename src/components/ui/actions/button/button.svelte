<script lang="ts">
  import { Link } from '@void/svelte'
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  type ButtonProps = Pick<HTMLButtonAttributes, 'aria-label' | 'disabled' | 'type'> & {
    align?: 'center' | 'start'
    children?: Snippet
    size?: 'default' | 'icon' | 'icon-lg' | 'icon-sm' | 'icon-xl' | 'icon-xs' | 'lg' | 'stretch' | 'sm'
    variant?: 'default' | 'destructive' | 'destructive-ghost' | 'destructive-outline' | 'ghost' | 'list-action' | 'outline' | 'secondary'
    width?: 'auto' | 'full'
  } & (
      | { asLink: true; href: string; onclick?: never; ref?: never; viewTransition?: boolean }
      | ({ asLink?: false; href?: never; ref?: HTMLButtonElement; viewTransition?: never } & Pick<
          HTMLButtonAttributes,
          'aria-expanded' | 'aria-haspopup' | 'onclick' | 'onpointerdown'
        >)
    )

  let {
    align = 'center',
    asLink,
    children,
    href,
    ref = $bindable(),
    size = 'default',
    variant = 'default',
    viewTransition,
    width = 'auto',
    ...rest
  }: ButtonProps = $props()
  const linkClass = $derived(
    `ui-button-link ui-button-link-align-${align} ui-button-link-size-${size} ui-button-link-variant-${variant} ui-button-link-width-${width}`
  )
</script>

{#if asLink && href !== undefined}
  <Link {...rest} class={linkClass} {href} {viewTransition}>{@render children?.()}</Link>
{:else}
  <button
    {...rest}
    bind:this={ref}
    class={[
      'button',
      {
        'align-center': align === 'center',
        'align-start': align === 'start',
        'size-default': size === 'default',
        'size-icon': size === 'icon',
        'size-icon-lg': size === 'icon-lg',
        'size-icon-sm': size === 'icon-sm',
        'size-icon-xl': size === 'icon-xl',
        'size-icon-xs': size === 'icon-xs',
        'size-lg': size === 'lg',
        'size-stretch': size === 'stretch',
        'size-sm': size === 'sm',
        'variant-default': variant === 'default',
        'variant-destructive': variant === 'destructive',
        'variant-destructive-ghost': variant === 'destructive-ghost',
        'variant-destructive-outline': variant === 'destructive-outline',
        'variant-ghost': variant === 'ghost',
        'variant-list-action': variant === 'list-action',
        'variant-outline': variant === 'outline',
        'variant-secondary': variant === 'secondary',
        'width-auto': width === 'auto',
        'width-full': width === 'full',
      },
    ]}>{@render children?.()}</button
  >
{/if}

<style>
  .button,
  :global(.ui-button-link) {
    --owner-icon-margin-inline: 0;
    --owner-icon-opacity: 1;
    --owner-icon-size: 18px;
    align-items: center;
    border-radius: var(--radius-lg);
    border-width: 1px;
    cursor: pointer;
    display: inline-flex;
    font-size: var(--font-sizes-base);
    font-weight: var(--font-weights-medium);
    gap: 8px;
    justify-content: center;
    position: relative;
    transition: box-shadow 150ms var(--easings-in-out);
    white-space: nowrap;
  }
  .button[data-disabled],
  .button:disabled,
  :global(.ui-button-link[data-disabled]),
  :global(.ui-button-link:disabled) {
    opacity: 0.38;
    pointer-events: none;
  }
  .button::before,
  :global(.ui-button-link::before) {
    content: '';
    background-color: currentColor;
    border-radius: inherit;
    inset: 0px;
    opacity: 0;
    pointer-events: none;
    position: absolute;
    transition: opacity 150ms var(--easings-in-out);
  }
  .button:is(:focus-visible, [data-focus-visible], :active, [data-active], [data-pressed], [aria-pressed='true'])::before,
  :global(.ui-button-link:is(:focus-visible, [data-focus-visible], :active, [data-active], [data-pressed], [aria-pressed='true'])::before) {
    opacity: 0.12;
  }
  .button:is(:disabled, [data-disabled])::before,
  :global(.ui-button-link:is(:disabled, [data-disabled])::before) {
    opacity: 0;
  }
  .button::after,
  :global(.ui-button-link::after) {
    content: '';
    display: none;
    inset: 0px;
    min-height: 44px;
    min-width: 44px;
    position: absolute;
  }
  .button:is(:focus-visible, [data-focus-visible]),
  :global(.ui-button-link:is(:focus-visible, [data-focus-visible])) {
    outline: 2px solid var(--colors-ring);
    outline-offset: 3px;
  }
  .align-start,
  :global(.ui-button-link-align-start) {
    justify-content: flex-start;
  }
  .size-default,
  :global(.ui-button-link-size-default) {
    height: 36px;
    padding-inline: 11px;
  }
  .size-icon,
  :global(.ui-button-link-size-icon) {
    height: 36px;
    width: 36px;
  }
  .size-icon-lg,
  :global(.ui-button-link-size-icon-lg) {
    flex-shrink: 0;
    height: 40px;
    width: 40px;
  }
  .size-icon-sm,
  :global(.ui-button-link-size-icon-sm) {
    height: 32px;
    width: 32px;
  }
  .size-icon-xl,
  :global(.ui-button-link-size-icon-xl) {
    --owner-icon-size: 20px;
    height: 44px;
    width: 44px;
  }
  .size-icon-xs,
  :global(.ui-button-link-size-icon-xs) {
    --owner-icon-size: 16px;
    border-radius: var(--radius-md);
    height: 28px;
    width: 28px;
  }
  .size-lg,
  :global(.ui-button-link-size-lg) {
    height: 40px;
    padding-inline: 13px;
  }
  .size-stretch,
  :global(.ui-button-link-size-stretch) {
    align-self: stretch;
    padding-inline: 11px;
  }
  .size-sm,
  :global(.ui-button-link-size-sm) {
    gap: 6px;
    height: 32px;
    padding-inline: 9px;
  }
  .variant-default,
  :global(.ui-button-link-variant-default) {
    background-color: var(--colors-primary);
    border-color: transparent;
    color: var(--colors-primary-foreground);
  }
  .variant-default:is(:active, [data-active], [data-pressed], :disabled, [data-disabled]),
  :global(.ui-button-link-variant-default:is(:active, [data-active], [data-pressed], :disabled, [data-disabled])) {
    box-shadow: var(--shadows-none);
  }
  .variant-destructive,
  :global(.ui-button-link-variant-destructive) {
    background-color: color-mix(in srgb, var(--colors-destructive) 80%, var(--colors-shadow));
    border-color: transparent;
    color: var(--colors-inverse-foreground);
  }
  .variant-destructive-ghost,
  :global(.ui-button-link-variant-destructive-ghost) {
    background-color: transparent;
    border-color: transparent;
    color: var(--colors-destructive-foreground);
  }
  .variant-destructive-outline,
  :global(.ui-button-link-variant-destructive-outline) {
    background-color: var(--colors-popover);
    border-color: var(--colors-destructive-foreground);
    color: var(--colors-destructive-foreground);
  }
  .variant-ghost,
  :global(.ui-button-link-variant-ghost) {
    background-color: transparent;
    border-color: transparent;
    color: var(--colors-foreground);
  }
  .variant-list-action,
  :global(.ui-button-link-variant-list-action) {
    background-color: transparent;
    border-color: transparent;
    border-radius: var(--radius-md);
    color: var(--colors-foreground);
    justify-content: flex-start;
    width: 100%;
  }
  .variant-outline,
  :global(.ui-button-link-variant-outline) {
    background-color: var(--colors-popover);
    border-color: var(--colors-input);
    color: var(--colors-foreground);
  }
  .variant-secondary,
  :global(.ui-button-link-variant-secondary) {
    background-color: var(--colors-secondary);
    border-color: transparent;
    color: var(--colors-secondary-foreground);
  }
  .width-full,
  :global(.ui-button-link-width-full) {
    width: 100%;
  }
  @media screen and (min-width: 640px) {
    .button,
    :global(.ui-button-link) {
      --owner-icon-size: 16px;
      font-size: var(--font-sizes-sm);
    }
    .size-default,
    :global(.ui-button-link-size-default) {
      height: 32px;
    }
    .size-icon,
    :global(.ui-button-link-size-icon) {
      height: 32px;
      width: 32px;
    }
    .size-icon-lg,
    :global(.ui-button-link-size-icon-lg) {
      height: 36px;
      width: 36px;
    }
    .size-icon-sm,
    :global(.ui-button-link-size-icon-sm) {
      height: 28px;
      width: 28px;
    }
    .size-icon-xl,
    :global(.ui-button-link-size-icon-xl) {
      --owner-icon-size: 18px;
      height: 40px;
      width: 40px;
    }
    .size-icon-xs,
    :global(.ui-button-link-size-icon-xs) {
      --owner-icon-size: 14px;
      height: 24px;
      width: 24px;
    }
    .size-lg,
    :global(.ui-button-link-size-lg) {
      height: 36px;
    }
    .size-sm,
    :global(.ui-button-link-size-sm) {
      height: 28px;
    }
  }
  @media (hover: hover) and (pointer: fine) {
    .button:hover::before,
    :global(.ui-button-link:hover::before) {
      opacity: 0.08;
    }
    .variant-default:hover,
    :global(.ui-button-link-variant-default:hover) {
      box-shadow: var(--shadows-sm);
    }
  }
  @media (pointer: coarse) {
    .button::after,
    :global(.ui-button-link::after) {
      display: block;
    }
  }
</style>
