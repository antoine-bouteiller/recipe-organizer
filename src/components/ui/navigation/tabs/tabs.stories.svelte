<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, userEvent, within } from 'storybook/test'

  import Tabs from './tabs.svelte'

  const { Story } = defineMeta({ component: Tabs, title: 'Navigation/Tabs' })
</script>

{#snippet ingredientsLabel()}Ingredients{/snippet}
{#snippet methodLabel()}Method{/snippet}
{#snippet ingredientsContent()}
  <section aria-label="Ingredients" class="section">
    <h2>Ingredients</h2>
    <p>2 tomatoes and fresh basil.</p>
  </section>
{/snippet}
{#snippet methodContent()}
  <section aria-label="Method" class="section">
    <h2>Method</h2>
    <p>Simmer for 20 minutes.</p>
  </section>
{/snippet}
{#snippet example()}
  <div class="container">
    <Tabs
      aria-label="Recipe details"
      items={[
        { content: ingredientsContent, label: ingredientsLabel, value: 'ingredients' },
        { content: methodContent, label: methodLabel, value: 'method' },
      ]}
    />
  </div>
{/snippet}

<Story name="Swipeable" asChild>{@render example()}</Story>
<Story
  name="Interaction"
  asChild
  tags={['!dev']}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const method = canvas.getByRole('link', { name: 'Method' })
    await expect(method).toHaveAttribute('href', '#method')
    const originalUrl = window.location.href
    const historyLength = history.length
    try {
      await userEvent.click(method)
      await expect(window.location.hash).toBe('#method')
      await expect(history.length).toBe(historyLength)
      await userEvent.click(canvas.getByRole('link', { name: 'Ingredients' }))
      await expect(window.location.hash).toBe('#ingredients')
      await expect(history.length).toBe(historyLength)
    } finally {
      history.replaceState(history.state, '', originalUrl)
    }
  }}>{@render example()}</Story
>

<style>
  .container {
    height: 256px;
    width: 100%;
  }

  .section {
    padding: 16px;
  }
</style>
