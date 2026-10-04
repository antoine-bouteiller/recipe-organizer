<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, within } from 'storybook/test'

  import AppHeader from './app-header.svelte'
  import ThemeToggle from './theme-toggle.svelte'

  const { Story } = defineMeta({ component: AppHeader, parameters: { layout: 'fullscreen' }, title: 'Navigation/App Header' })
</script>

<Story
  name="Current Section"
  asChild
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // The desktop navbar is hidden on narrow test viewports; this checks semantics, not visibility.
    const hidden = true
    await expect(canvas.getByRole('link', { hidden, name: 'Paramètres' })).toHaveAttribute('aria-current', 'page')
    await expect(canvas.getByRole('link', { hidden, name: 'Accueil' })).not.toHaveAttribute('aria-current')
    await expect(canvas.queryByRole('link', { hidden, name: 'Rechercher' })).not.toBeInTheDocument()
    await expect(canvas.getByRole('button', { hidden, name: 'Changer de thème' })).toBeInTheDocument()
  }}
>
  <AppHeader currentPath="/settings/users"><ThemeToggle /></AppHeader>
</Story>
