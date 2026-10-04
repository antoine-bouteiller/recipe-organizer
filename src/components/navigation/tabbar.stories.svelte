<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, userEvent, within } from 'storybook/test'

  import { mobileMenuItems } from './menu-items.svelte'
  import TabBar from './tabbar.svelte'

  const { Story } = defineMeta({
    component: TabBar,
    globals: { viewport: { isRotated: false, value: 'mobile2' } },
    parameters: { layout: 'fullscreen' },
    title: 'Navigation/TabBar',
  })
</script>

<script lang="ts">
  let currentPath = $state('/')

  // Stands in for page navigation inside the story frame.
  const navigate = (event: MouseEvent) => {
    const link = event.target instanceof Element ? event.target.closest('a') : null
    if (link) {
      event.preventDefault()
      currentPath = new URL(link.href).pathname
    }
  }
</script>

{#snippet example()}
  <div class="container">
    <main class="app-surface">
      <span>App surface</span>
      <section class="content-surface">Content surface</section>
    </main>
    <div onclickcapture={navigate} role="presentation">
      <TabBar {currentPath} items={mobileMenuItems} />
    </div>
  </div>
{/snippet}

<Story name="Mobile" asChild>
  {@render example()}
</Story>

<Story
  name="Interaction"
  asChild
  tags={['!dev']}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const homeLink = canvas.getByRole('link', { name: 'Accueil' })
    const shoppingLink = canvas.getByRole('link', { name: 'Courses' })

    await expect(homeLink).toHaveAttribute('aria-current', 'page')
    await expect(canvas.getByRole('link', { name: 'Rechercher' })).toHaveAttribute('href', '/search')
    await userEvent.tab()
    await expect(homeLink).toHaveFocus()

    await userEvent.click(shoppingLink)
    await expect(shoppingLink).toHaveAttribute('aria-current', 'page')
    await expect(homeLink).not.toHaveAttribute('aria-current')

    await userEvent.click(homeLink)
    await expect(homeLink).toHaveAttribute('aria-current', 'page')
  }}
>
  {@render example()}
</Story>

<style>
  .container {
    background-color: var(--colors-background);
    height: 192px;
    position: relative;
  }

  .app-surface {
    background-color: var(--colors-background);
    color: var(--colors-foreground);
    display: grid;
    gap: 8px;
    padding: 12px;
  }

  .content-surface {
    background-color: var(--colors-card);
    color: var(--colors-card-foreground);
    border-radius: var(--radius-2xl);
    padding: 12px;
  }
</style>
