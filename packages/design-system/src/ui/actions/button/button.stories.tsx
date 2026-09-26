import { Toggle as TogglePrimitive } from '@base-ui/react/toggle'
import { PlusIcon } from '@recipe-organizer/design-system/icons/plus'
import { SearchInput } from '@recipe-organizer/design-system/search-input'
import { Select } from '@recipe-organizer/design-system/select'
import { StorySection } from '@storybook-helpers/story-section'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import { Toggle } from '../toggle/toggle'
import { Button } from './button'

import * as styles from './button.stories.css'

const meta = {
  component: Button,
  title: 'Actions/Button',
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const InteractionStates: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const toggle = canvas.getByRole('button', { name: 'Save recipe' })
    await userEvent.tab()
    await expect(toggle).toHaveFocus()
    await userEvent.click(toggle)
    await expect(toggle).toHaveAttribute('aria-pressed', 'true')
    await expect(canvas.getByRole('button', { name: 'Unavailable' })).toBeDisabled()
  },
  render: () => (
    <div className={styles.buttonGroup}>
      <TogglePrimitive render={<Button variant="secondary" />}>Save recipe</TogglePrimitive>
      <Button disabled>Unavailable</Button>
    </div>
  ),
  tags: ['!dev'],
}

export const SearchAction: Story = {
  render: () => (
    <div className={styles.comparisonRow}>
      <div className={styles.searchRow}>
        <SearchInput search="" setSearch={fn()} />
        <Button aria-label="Add item" size="icon-lg" variant="outline">
          <PlusIcon />
        </Button>
      </div>
      <Select items={[{ label: 'Active', value: 'active' }]} onValueChange={fn()} placeholder="Choose status" value={null} />
      <Toggle aria-label="Filter recipes" variant="outline">
        Filter
      </Toggle>
      <Button aria-label="Unavailable add item" disabled size="icon-lg" variant="outline">
        <PlusIcon />
      </Button>
    </div>
  ),
}

export const SearchActionKeyboardFocus: Story = {
  ...SearchAction,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'Add item' })
    await userEvent.click(canvas.getByRole('textbox'))
    await userEvent.tab()
    await expect(button).toHaveFocus()
  },
  tags: ['!dev'],
}

export const Overview: Story = {
  args: { children: 'Save changes' },
  render: (args) => (
    <div className={styles.container}>
      <StorySection title="Default">
        <Button {...args} />
      </StorySection>
      <StorySection title="Variants">
        <div className={styles.buttonGroup}>
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Delete</Button>
          <Button variant="destructive-outline">Remove</Button>
          <Button variant="destructive-ghost">Delete quietly</Button>
        </div>
      </StorySection>
      <StorySection title="Sizes">
        <div className={styles.sizeOptions}>
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">Large</Button>
          <Button align="start" variant="list-action" width="full">
            List action
          </Button>
          {(['icon-xs', 'icon-sm', 'icon', 'icon-lg', 'icon-xl'] as const).map((size) => (
            <Button aria-label={`Add item (${size})`} key={size} size={size}>
              <PlusIcon />
            </Button>
          ))}
        </div>
      </StorySection>
      <StorySection title="Disabled">
        <div className={styles.buttonGroup}>
          <Button disabled>Unavailable</Button>
          <Button disabled variant="secondary">
            Secondary
          </Button>
          <Button disabled variant="outline">
            Outline
          </Button>
          <Button disabled variant="ghost">
            Ghost
          </Button>
          <Button disabled variant="destructive">
            Delete
          </Button>
        </div>
      </StorySection>
    </div>
  ),
}
