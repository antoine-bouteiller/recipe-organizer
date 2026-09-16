import { css } from '@recipe-organizer/design-system/css'
import { type Meta, type StoryObj } from '@storybook/react-vite'

import { StorySection } from '../../../../.storybook/story-section'
import { NumberInput } from './number-input'

const meta = {
  args: { defaultValue: 2, label: 'Servings', max: 12, min: 0 },
  component: NumberInput,
  title: 'Forms/Number Input',
} satisfies Meta<typeof NumberInput>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: (args) => (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '8', minWidth: 0, width: 'full' })}>
      <StorySection title="Default">
        <NumberInput {...args} />
      </StorySection>
      <StorySection title="Empty">
        <NumberInput {...args} defaultValue={undefined} label="Servings" placeholder="0" />
      </StorySection>
      <StorySection title="Invalid">
        <NumberInput {...args} aria-invalid defaultValue={20} label="Servings" max={12} />
      </StorySection>
      <StorySection title="Disabled">
        <NumberInput {...args} defaultValue={2} disabled label="Servings" />
      </StorySection>
    </div>
  ),
}
