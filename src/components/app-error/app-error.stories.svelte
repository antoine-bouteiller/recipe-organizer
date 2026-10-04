<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, userEvent, within } from 'storybook/test'

  import AppError from './app-error.svelte'
  import Throwing from './throwing.example.svelte'

  const { Story } = defineMeta({ component: AppError, parameters: { layout: 'fullscreen' }, title: 'Feedback/App Error' })
</script>

<script lang="ts">
  let pathname = $state('/broken')
</script>

<Story
  name="Recovery"
  asChild
  tags={['!dev']}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toHaveTextContent('Une erreur est survenue')
    await expect(canvas.getByRole('link', { name: "Retour à la page d'accueil" })).toHaveAttribute('href', '/')
    await userEvent.click(canvas.getByRole('button', { name: 'Navigate' }))
    await expect(canvas.queryByRole('alert')).not.toBeInTheDocument()
    await expect(canvas.getByText('Page content')).toBeVisible()
  }}
>
  <button onclick={() => (pathname = '/working')} type="button">Navigate</button>
  {#key pathname}
    <AppError><Throwing shouldThrow={pathname === '/broken'} /></AppError>
  {/key}
</Story>
