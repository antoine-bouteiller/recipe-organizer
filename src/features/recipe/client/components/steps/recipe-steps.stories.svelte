<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, userEvent, within } from 'storybook/test'

  import Example from './recipe-steps.example.svelte'

  const { Story } = defineMeta({ component: Example, title: 'Recipe/RecipeSteps' })
  // Editor VC-5, migration VC-4: embedded instructions follow refreshed source props without an editor.
  const play = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Sauce tomate')).toBeVisible()
    await expect(canvas.getAllByRole('listitem')).toHaveLength(4)
    await expect(canvas.getByText('<b>reste littéral</b>', { exact: false })).toBeVisible()
    await expect(canvas.queryByRole('textbox')).not.toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Actualiser les instructions' }))
    await expect(canvas.getByText('Poivrer')).toBeVisible()
    await expect(canvas.getAllByRole('listitem')).toHaveLength(5)
    await expect(canvas.queryByRole('button', { name: 'Gras' })).not.toBeInTheDocument()
  }
</script>

<Story name="Live embedded instructions (VC-4)" {play} />
