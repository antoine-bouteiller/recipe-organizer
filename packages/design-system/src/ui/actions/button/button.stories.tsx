import { Toggle as TogglePrimitive } from '@base-ui/react/toggle'
import { type Meta, type StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { StorySection } from '../../../../.storybook/story-section'
import { PlusIcon } from '../../data-display/icons/plus'
import { SearchInput } from '../../forms/search-input/search-input'
import { Select } from '../../forms/select/select'
import { Toggle } from '../toggle/toggle'
import { Button } from './button'

import { comparisonRow, container, container2, container3, popoverSurface, searchRow } from './button.stories.css'

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
      <TogglePrimitive render={<Button variant="secondary" />}>Save recipe</TogglePrimitive>
      <Button disabled>Unavailable</Button>
    </div>
  ),
}

export const SearchAction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'Add item' })
    const disabledButton = canvas.getByRole('button', { name: 'Unavailable add item' })
    const toggle = canvas.getByRole('button', { name: 'Filter recipes' })
    const searchInput = canvas.getByRole('group')
    const popover = canvas.getByText('Popover surface')
    const select = await canvas.findByText('Choose status')
    const selectTrigger = select.closest('button')
    if (!selectTrigger) {
      throw new Error('SearchAction requires the Select trigger')
    }
    const { width, height } = button.getBoundingClientRect()
    const popoverColor = getComputedStyle(popover).backgroundColor

    await expect(width).toBe(height)
    await expect(getComputedStyle(button).borderRadius).toBe(getComputedStyle(searchInput).borderRadius)
    await expect(getComputedStyle(button).borderRadius).toBe(getComputedStyle(selectTrigger).borderRadius)
    await expect(getComputedStyle(button).borderRadius).toBe(getComputedStyle(toggle).borderRadius)
    await expect(getComputedStyle(button).borderColor).toBe(getComputedStyle(selectTrigger).borderColor)
    await expect(getComputedStyle(button).borderColor).toBe(getComputedStyle(toggle).borderColor)
    await expect(getComputedStyle(button).backgroundColor).toBe(popoverColor)
    await expect(getComputedStyle(button).backgroundColor).toMatch(/^rgb\(/)
    await expect(getComputedStyle(disabledButton).backgroundColor).toBe(popoverColor)
    await expect(getComputedStyle(disabledButton).backgroundColor).toMatch(/^rgb\(/)
    await expect(getComputedStyle(disabledButton).opacity).toBe('0.38')

    await userEvent.hover(button)
    await expect(getComputedStyle(button).backgroundColor).toBe(popoverColor)
    await expect(getComputedStyle(button, '::before').borderRadius).toBe(getComputedStyle(button).borderRadius)
    await userEvent.click(canvas.getByRole('textbox'))
    await userEvent.tab()
    await expect(button).toHaveFocus()
    await waitFor(() => expect(getComputedStyle(button, '::before').opacity).toBe('0.12'))
    await expect(getComputedStyle(button).backgroundColor).toBe(popoverColor)
    await userEvent.keyboard('{Space>}')
    await waitFor(() => expect(getComputedStyle(button, '::before').opacity).toBe('0.12'))
    await expect(getComputedStyle(button).backgroundColor).toBe(popoverColor)
    await userEvent.keyboard('{/Space}')
  },
  render: () => (
    <div className={comparisonRow}>
      <span className={popoverSurface} data-slot="popover-surface">
        Popover surface
      </span>
      <div className={searchRow}>
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
