<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, userEvent, within } from 'storybook/test'

  import Example from './form.example.svelte'

  const { Story } = defineMeta({ component: Example, title: 'Forms/Form' })
</script>

<Story name="Default" asChild><Example /></Story>
<Story
  name="Validation And Submission"
  asChild
  tags={['!dev']}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Save recipe' }))
    await expect(canvas.getByText('A recipe name is required.')).toBeVisible()
    await expect(canvas.queryByRole('status')).not.toBeInTheDocument()
    await userEvent.type(canvas.getByRole('textbox', { name: 'Recipe name' }), 'Tomato soup')
    await userEvent.click(canvas.getByRole('button', { name: 'Save recipe' }))
    await expect(canvas.getByRole('status')).toHaveTextContent('Recipe saved.')
  }}><Example /></Story
>
