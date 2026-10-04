<script lang="ts">
  import type { Snippet } from 'svelte'

  const { children, for: htmlFor }: { children: Snippet; for?: string } = $props()
</script>

<label class="label" data-slot="label" for={htmlFor}>{@render children()}</label>

<style>
  .label {
    align-items: center;
    color: var(--colors-foreground);
    display: inline-flex;
    font-size: var(--font-sizes-base);
    font-weight: var(--font-weights-medium);
    gap: 8px;
    line-height: 18px;
  }

  @media screen and (min-width: 640px) {
    .label {
      font-size: var(--font-sizes-sm);
      line-height: 16px;
    }
  }
</style>
