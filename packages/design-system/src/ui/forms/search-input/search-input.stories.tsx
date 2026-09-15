import { type Meta, type StoryObj } from '@storybook/react-vite'
import { useState, type ReactElement } from 'react'
import { expect, userEvent, within } from 'storybook/test'

import { SearchInput } from './search-input'

const SearchInputExample = (): ReactElement => {
  const [search, setSearch] = useState('')

  return (
    <div className="space-y-2">
      <label className="block space-y-2">
        <span>Search recipes</span>
        <SearchInput search={search} setSearch={setSearch} />
      </label>
      <p role="status">{search ? `Searching for ${search}` : 'Enter a recipe or ingredient'}</p>
    </div>
  )
}

const meta = {
  component: SearchInputExample,
  tags: ['autodocs'],
  title: 'Forms/SearchInput',
} satisfies Meta<typeof SearchInputExample>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByRole('textbox', { name: 'Rechercher…' }), 'tomato')
    await expect(canvas.getByRole('status')).toHaveTextContent('Searching for tomato')
  },
}

export const WithCustomPlaceholder: Story = {
  render: () => {
    const [search, setSearch] = useState('')

    return (
      <label className="block space-y-2">
        <span>Search ingredients</span>
        <SearchInput placeholder="Search ingredients…" search={search} setSearch={setSearch} />
      </label>
    )
  },
}
