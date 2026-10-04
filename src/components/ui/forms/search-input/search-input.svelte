<script lang="ts">
  import { onMount } from 'svelte'

  import { MagnifyingGlassIcon } from '@/components/ui/data-display/icons'

  const {
    autoFocus,
    placeholder = 'Rechercher…',
    search,
    setSearch,
  }: { autoFocus?: boolean; placeholder?: string; search: string; setSearch: (value: string) => void } = $props()
  let input: HTMLInputElement | undefined = undefined
  onMount(() => {
    if (autoFocus) {
      input?.focus()
    }
  })
</script>

<div class="root" data-slot="input-group" role="group">
  <input
    aria-label={placeholder}
    bind:this={input}
    class="input"
    data-slot="input"
    oninput={(event) => setSearch(event.currentTarget.value)}
    {placeholder}
    value={search}
  />
  <div
    class="addon"
    data-slot="input-group-addon"
    aria-hidden="true"
    onmousedown={(event) => {
      event.preventDefault()
      input?.focus()
    }}
  >
    <span class="text"><MagnifyingGlassIcon /></span>
  </div>
</div>

<style>
  .root {
    background-color: var(--colors-background);
    background-clip: padding-box;
    -webkit-background-clip: padding-box;
    border-color: var(--colors-input);
    border-radius: var(--radius-lg);
    border-width: 1px;
    box-shadow: var(--shadows-xs);
    color: var(--colors-foreground);
    display: inline-flex;
    font-size: var(--font-sizes-base);
    position: relative;
    transition-duration: 150ms;
    transition-property: box-shadow;
    transition-timing-function: var(--easings-in-out);
    width: 100%;
    align-items: center;
    min-width: 0px;
  }

  .root:has(:autofill) {
    background-color: color-mix(in srgb, var(--colors-foreground) 4%, transparent);
  }

  .root:has(:disabled) {
    opacity: 0.64;
  }

  .root:has(:disabled, :focus-visible, [aria-invalid]) {
    box-shadow: var(--shadows-none);
  }

  .root:has(:focus-visible) {
    border-color: var(--colors-ring);
    box-shadow: var(--shadows-ring);
    border-width: 1px;
  }

  :global(.dark) .root:has(:autofill) {
    background-color: color-mix(in srgb, var(--colors-foreground) 8%, transparent);
  }

  :global(.dark) .root {
    background-clip: border-box;
    -webkit-background-clip: border-box;
  }

  @media screen and (min-width: 640px) {
    .root {
      font-size: var(--font-sizes-sm);
    }
  }

  .input {
    background-color: transparent;
    border-radius: inherit;
    height: 38px;
    line-height: 38px;
    min-width: 0px;
    outline: 2px solid transparent;
    outline-offset: 2px;
    padding-left: 8px;
    padding-right: 11px;
    transition: background-color 5000000s ease-in-out 0s;
    width: 100%;
  }

  .input::placeholder {
    color: color-mix(in srgb, var(--colors-muted-foreground) 72%, transparent);
  }

  @media screen and (min-width: 640px) {
    .input {
      height: 34px;
      line-height: 34px;
    }
  }

  .addon {
    align-items: center;
    cursor: text;
    display: flex;
    gap: 8px;
    justify-content: center;
    order: -1;
    padding-left: 11px;
    -webkit-user-select: none;
    user-select: none;
    --owner-icon-size: 18px;
  }

  @media screen and (min-width: 640px) {
    .addon {
      --owner-icon-size: 16px;
    }
  }

  .text {
    display: flex;
    margin-inline: -2px;
    opacity: 0.8;
  }
</style>
