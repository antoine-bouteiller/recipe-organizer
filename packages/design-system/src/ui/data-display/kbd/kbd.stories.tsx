import { StorySection } from '@storybook-helpers/story-section'
import { type Meta, type StoryObj } from '@storybook/react-vite'

import { Kbd, KbdGroup } from './kbd'

import * as styles from './kbd.stories.css'

const meta = {
  component: Kbd,
  title: 'Data Display/Kbd',
} satisfies Meta<typeof Kbd>
export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  args: { children: '⌘' },
  render: (args) => (
    <div className={styles.container}>
      <StorySection title="Default">
        <Kbd {...args} />
      </StorySection>
      <StorySection title="Shortcut">
        <p className={styles.text}>
          Save changes with{' '}
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>S</Kbd>
          </KbdGroup>
        </p>
      </StorySection>
    </div>
  ),
}
