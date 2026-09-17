import { type Meta, type StoryObj } from '@storybook/react-vite'
import { useState, type ReactElement } from 'react'
import { expect, userEvent, within } from 'storybook/test'

import { StorySection } from '../../../../.storybook/story-section'
import { SearchInput } from './search-input'

import { container, label, label2, container2 } from './search-input.stories.css'

const SearchInputExample = (): ReactElement => {
  const [search, setSearch] = useState('')

  return (
    <div className={container}>
      <label className={label}>
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
    <label className={label2}>
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
    await expect(getComputedStyle(canvas.getByRole('group')).backdropFilter).toBe('none')
    await userEvent.type(canvas.getByRole('textbox', { name: 'Rechercher…' }), 'tomato')
    await expect(canvas.getByRole('status')).toHaveTextContent('Searching for tomato')
  },
  render: () => (
    <div className={container2}>
      <StorySection title="Default">
        <SearchInputExample />
      </StorySection>
      <StorySection title="With Custom Placeholder">
        <CustomPlaceholderExample />
      </StorySection>
    </div>
  ),
}
