import { css } from '@recipe-organizer/design-system/css'
import { type Meta, type StoryObj } from '@storybook/react-vite'
import { useState, type ReactElement } from 'react'
import { expect, userEvent, within } from 'storybook/test'

import { StorySection } from '../../../../.storybook/story-section'
import { SearchInput } from './search-input'

const SearchInputExample = (): ReactElement => {
  const [search, setSearch] = useState('')

  return (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '2' })}>
      <label className={css({ display: 'flex', flexDirection: 'column', gap: '2' })}>
        <span>Search recipes</span>
        <SearchInput search={search} setSearch={setSearch} />
      </label>
      <p role="status">{search ? `Searching for ${search}` : 'Enter a recipe or ingredient'}</p>
    </div>
  )
}

const CustomPlaceholderExample = (): ReactElement => {
  const [search, setSearch] = useState('')

  return (
    <label className={css({ display: 'flex', flexDirection: 'column', gap: '2' })}>
      <span>Search ingredients</span>
      <SearchInput placeholder="Search ingredients…" search={search} setSearch={setSearch} />
    </label>
  )
}

const meta = {
  component: SearchInputExample,
  title: 'Forms/SearchInput',
} satisfies Meta<typeof SearchInputExample>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  play: async ({ canvasElement }) => {
    const section = within(canvasElement).getByRole('region', { name: 'Default' })
    const canvas = within(section)
    await userEvent.type(canvas.getByRole('textbox', { name: 'Rechercher…' }), 'tomato')
    await expect(canvas.getByRole('status')).toHaveTextContent('Searching for tomato')
  },
  render: () => (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '8', minWidth: 0, width: 'full' })}>
      <StorySection title="Default">
        <SearchInputExample />
      </StorySection>
      <StorySection title="With Custom Placeholder">
        <CustomPlaceholderExample />
      </StorySection>
    </div>
  ),
}
