<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, userEvent, within } from 'storybook/test'

  import Example from './settings-content.example.svelte'

  const { Story } = defineMeta({ component: Example, title: 'Features/Settings/SettingsContent' })
</script>

<Story name="Default" asChild><Example /></Story>
<Story
  name="VC-3 Refreshed Administration Permissions"
  asChild
  tags={['!dev']}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('link', { name: /Compte/ })).toHaveAttribute('href', '/settings/account')
    await expect(canvas.getByRole('link', { name: /Ingrédients/ })).toHaveAttribute('href', '/settings/ingredients')
    await expect(canvas.queryByRole('link', { name: /Utilisateurs/ })).not.toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Changer les permissions' }))
    await expect(canvas.getByRole('link', { name: /Utilisateurs/ })).toHaveAttribute('href', '/settings/users')
    await userEvent.click(canvas.getByRole('button', { name: 'Changer les permissions' }))
    await expect(canvas.queryByRole('link', { name: /Utilisateurs/ })).not.toBeInTheDocument()
  }}><Example /></Story
>
