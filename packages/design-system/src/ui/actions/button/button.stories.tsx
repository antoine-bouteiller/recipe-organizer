import { Toggle } from '@base-ui/react/toggle'
import { type Meta, type StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { StorySection } from '../../../../.storybook/story-section'
import { PlusIcon } from '../../data-display/icons/plus'
import { SearchInput } from '../../forms/search-input/search-input'
import { Button } from './button'

import { container, container2, container3, searchRow } from './button.stories.css'

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
    await expect(getComputedStyle(toggle).outlineStyle).toBe('solid')
    await userEvent.click(toggle)
    await expect(toggle).toHaveAttribute('aria-pressed', 'true')
    await waitFor(() => expect(getComputedStyle(toggle, '::before').opacity).toBe('0.12'))
    await expect(canvas.getByRole('button', { name: 'Unavailable' })).toBeDisabled()
    await expect(getComputedStyle(canvas.getByRole('button', { name: 'Unavailable' }), '::before').opacity).toBe('0')
  },
  render: () => (
    <div className={container2}>
      <Toggle render={<Button variant="secondary" />}>Save recipe</Toggle>
      <Button disabled>Unavailable</Button>
    </div>
  ),
}

export const SearchAction: Story = {
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Add item' })
    const { width, height } = button.getBoundingClientRect()
    await expect(width).toBe(height)
    await expect(getComputedStyle(button).backgroundColor).toMatch(/^rgb\(/)
  },
  render: () => (
    <div className={searchRow}>
      <SearchInput search="" setSearch={fn()} />
      <Button aria-label="Add item" size="icon-lg" variant="outline">
        <PlusIcon />
      </Button>
    </div>
  ),
}

export const Overview: Story = {
  args: { children: 'Save changes' },
  render: (args) => (
    <div className={container}>
      <StorySection title="Default">
        <Button {...args} />
      </StorySection>
      <StorySection title="Variants">
        <div className={container2}>
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
        <div className={container3}>
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
        <div className={container2}>
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
