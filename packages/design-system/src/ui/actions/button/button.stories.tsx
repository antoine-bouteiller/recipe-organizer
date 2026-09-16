import { css } from '@recipe-organizer/design-system/css'
import { type Meta, type StoryObj } from '@storybook/react-vite'

import { StorySection } from '../../../../.storybook/story-section'
import { PlusIcon } from '../../data-display/icons/plus'
import { Button } from './button'

const meta = {
  component: Button,
  title: 'Actions/Button',
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  args: { children: 'Save changes' },
  render: (args) => (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '8', minWidth: '0', width: 'full' })}>
      <StorySection title="Default">
        <Button {...args} />
      </StorySection>
      <StorySection title="Variants">
        <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '3' })}>
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Delete</Button>
          <Button variant="destructive-outline">Remove</Button>
          <Button variant="destructive-ghost">Delete quietly</Button>
          <Button variant="media-overlay-card">Card overlay</Button>
          <Button variant="media-overlay-header">Header overlay</Button>
          <Button variant="search-trigger">Search</Button>
        </div>
      </StorySection>
      <StorySection title="Sizes">
        <div className={css({ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: '3' })}>
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">Large</Button>
          <Button align="start" variant="list-action" width="full">
            List action
          </Button>
          <Button aria-label="Add item" size="icon">
            <PlusIcon />
          </Button>
        </div>
      </StorySection>
      <StorySection title="Disabled">
        <Button disabled>Unavailable</Button>
      </StorySection>
    </div>
  ),
}
