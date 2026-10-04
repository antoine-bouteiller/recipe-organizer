<script lang="ts">
  import type { Snippet } from 'svelte'

  import * as styles from './story-section.css'

  interface Props {
    children: Snippet
    title: string
  }

  const { children, title }: Props = $props()
  const id = $props.id()
</script>

<section aria-labelledby={id} class={styles.section}>
  <h2 class={styles.heading} {id}>{title}</h2>
  {@render children()}
</section>
