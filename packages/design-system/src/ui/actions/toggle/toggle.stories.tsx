import { css } from '@recipe-organizer/design-system/css'
import { type Meta, type StoryObj } from '@storybook/react-vite'

import { StorySection } from '../../../../.storybook/story-section'
import { Toggle } from './toggle'

const meta = {
  args: { 'aria-label': 'Bold text', children: 'Bold' },
  component: Toggle,
  title: 'Actions/Toggle',
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: (args) => (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '8', minWidth: '0', width: 'full' })}>
      <StorySection title="Default">
        <Toggle {...args} />
      </StorySection>
      <StorySection title="Pressed">
        <Toggle {...args} defaultPressed />
      </StorySection>
      <StorySection title="Outline">
        <Toggle {...args} variant="outline" />
      </StorySection>
      <StorySection title="Filter">
        <Toggle {...args} aria-label="Filter recipes" defaultPressed presentation="filter">
          Filter recipes
        </Toggle>
      </StorySection>
      <StorySection title="Disabled">
        <Toggle {...args} disabled />
      </StorySection>
    </div>
  ),
}
