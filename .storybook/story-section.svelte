<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    children: Snippet
    title: string
  }

  const { children, title }: Props = $props()
  const id = $props.id()
</script>

<section aria-labelledby={id} class="section">
  <h2 class="heading" {id}>{title}</h2>
  {@render children()}
</section>

<style>
  .section {
    border-bottom-width: 1px;
    border-color: var(--colors-border);
    padding-bottom: 32px;
  }
  .section:last-child {
    border-bottom-width: 0;
    padding-bottom: 0;
  }

  .heading {
    font-size: var(--font-sizes-lg);
    font-weight: var(--font-weights-semibold);
  }

  .section > :global(* + *) {
    margin-top: 16px;
  }
</style>
