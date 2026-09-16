import { css } from '@recipe-organizer/design-system/css'
import { type Meta, type StoryObj } from '@storybook/react-vite'

import { StorySection } from '../../../../.storybook/story-section'
import { Label } from './label'

const meta = {
  component: Label,
  title: 'Forms/Label',
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  args: { children: 'Email address', htmlFor: 'email' },
  render: (args) => (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '8', minWidth: 0, width: 'full' })}>
      <StorySection title="Default">
        <div className={css({ display: 'grid', gap: '2', width: '80' })}>
          <Label {...args} />
          <input
            className={css({
              backgroundColor: 'background',
              border: '1px solid',
              borderColor: 'input',
              borderRadius: 'md',
              fontSize: 'sm',
              height: '9',
              paddingInline: '3',
            })}
            id="email"
            placeholder="name@example.com"
            type="email"
          />
        </div>
      </StorySection>
      <StorySection title="Disabled">
        <div className={css({ display: 'grid', gap: '2', width: '80' })}>
          <Label htmlFor="disabled-email">Email address</Label>
          <input
            className={css({
              _disabled: { opacity: 0.64 },
              backgroundColor: 'background',
              border: '1px solid',
              borderColor: 'input',
              borderRadius: 'md',
              fontSize: 'sm',
              height: '9',
              paddingInline: '3',
            })}
            disabled
            id="disabled-email"
            value="name@example.com"
          />
        </div>
      </StorySection>
    </div>
  ),
}
