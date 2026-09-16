import { css } from '@recipe-organizer/design-system/css'
import { type Meta, type StoryObj } from '@storybook/react-vite'

import { StorySection } from '../../../../.storybook/story-section'
import { Kbd, KbdGroup } from './kbd'

const meta = {
  component: Kbd,
  title: 'Data Display/Kbd',
} satisfies Meta<typeof Kbd>
export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  args: { children: '⌘' },
  render: (args) => (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '8', minWidth: '0', width: 'full' })}>
      <StorySection title="Default">
        <Kbd {...args} />
      </StorySection>
      <StorySection title="Shortcut">
        <p className={css({ fontSize: 'sm' })}>
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
