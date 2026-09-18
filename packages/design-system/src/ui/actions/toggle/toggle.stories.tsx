import { StorySection } from '@storybook-helpers/story-section'
import { type Meta, type StoryObj } from '@storybook/react-vite'

import { Toggle } from './toggle'

import * as styles from './toggle.stories.css'

const meta = {
  args: { 'aria-label': 'Bold text', children: 'Bold' },
  component: Toggle,
  title: 'Actions/Toggle',
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: (args) => (
    <div className={styles.container}>
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
