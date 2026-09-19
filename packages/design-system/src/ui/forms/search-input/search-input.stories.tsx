import { StorySection } from '@storybook-helpers/story-section'
import { type Meta, type StoryObj } from '@storybook/react-vite'
import { useState, type ReactElement } from 'react'
import { expect, userEvent, within } from 'storybook/test'

import { SearchInput } from './search-input'

import * as styles from './search-input.stories.css'

const SearchInputExample = (): ReactElement => {
  const [search, setSearch] = useState('')

  return (
    <div className={styles.container}>
      <label className={styles.label}>
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
    <label className={styles.customPlaceholderField}>
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
  render: () => (
    <div className={styles.storyLayout}>
      <StorySection title="Default">
        <SearchInputExample />
      </StorySection>
      <StorySection title="With Custom Placeholder">
        <CustomPlaceholderExample />
      </StorySection>
    </div>
  ),
}

export const Interaction: Story = {
  ...Overview,
  play: async ({ canvasElement }) => {
    const section = within(canvasElement).getByRole('region', { name: 'Default' })
    const canvas = within(section)
    await userEvent.type(canvas.getByRole('textbox', { name: 'Rechercher…' }), 'tomato')
    await expect(canvas.getByRole('status')).toHaveTextContent('Searching for tomato')
  },
  tags: ['!dev'],
}
