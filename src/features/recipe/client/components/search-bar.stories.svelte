<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, spyOn, userEvent, waitFor, within } from 'storybook/test'

  import SearchBar from './search-bar.svelte'

  const { Story } = defineMeta({ component: SearchBar, title: 'Navigation/SearchBar' })
</script>

<Story
  name="VC-5 Lazy Loading Failure Recovery And Keyboard Filtering"
  tags={['!dev']}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)
    const fetched = spyOn(globalThis, 'fetch')
    fetched.mockRejectedValueOnce(new Error('offline'))
    try {
      await expect(fetched).not.toHaveBeenCalled()
      const trigger = canvas.getByRole('button', { name: /Recherche une recette/ })
      await userEvent.click(trigger)
      await expect(await body.findByRole('alert')).toHaveTextContent('Impossible de charger les recettes')
      await userEvent.keyboard('{Escape}')
      await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument())
      await expect(trigger).toHaveFocus()
      fetched.mockResolvedValueOnce(
        new Response(
          JSON.stringify([
            { id: 1, name: 'Crème de tomate' },
            { id: 2, name: 'Soupe de légumes' },
          ]),
          {
            headers: { 'content-type': 'application/json' },
          }
        )
      )
      await userEvent.keyboard('{Control>}k{/Control}')
      const input = await body.findByRole('combobox', { name: 'Rechercher une recette' })
      await waitFor(() => expect(body.getAllByRole('option')).toHaveLength(2))
      const requestsAfterLoad = fetched.mock.calls.filter(([request]) =>
        (request instanceof Request ? request.url : String(request)).includes('/api/recipes')
      ).length
      await expect(input).toHaveFocus()
      const first = body.getByRole('option', { name: 'Crème de tomate' })
      const second = body.getByRole('option', { name: 'Soupe de légumes' })
      await expect(first).toHaveAttribute('aria-selected', 'true')
      await userEvent.keyboard('{ArrowDown}')
      await expect(second).toHaveAttribute('aria-selected', 'true')
      await userEvent.type(input, 'creme')
      await expect(body.getAllByRole('option')).toHaveLength(1)
      await expect(first).toHaveAttribute('aria-selected', 'true')
      await userEvent.clear(input)
      await userEvent.type(input, 'missing')
      await expect(body.getByText('Aucun résultats trouvé.')).toBeVisible()
      await userEvent.keyboard('{Escape}')
      await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument())
      await userEvent.click(trigger)
      await waitFor(() => expect(body.getAllByRole('option')).toHaveLength(2))
      await expect(
        fetched.mock.calls.filter(([request]) => (request instanceof Request ? request.url : String(request)).includes('/api/recipes'))
      ).toHaveLength(requestsAfterLoad)
      await userEvent.keyboard('{Escape}')
      await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument())
    } finally {
      fetched.mockRestore()
    }
  }}
/>
