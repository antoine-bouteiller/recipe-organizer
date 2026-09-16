import { css } from '@recipe-organizer/design-system/css'
import { type Meta, type StoryObj } from '@storybook/react-vite'

import { StorySection } from '../../../../.storybook/story-section'
import { Separator } from './separator'

const meta = {
  component: Separator,
  title: 'Layout/Separator',
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: () => (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '8', minWidth: '0', width: 'full' })}>
      <StorySection title="Default">
        <div className={css({ width: '80' })}>
          <p className={css({ fontSize: 'sm', fontWeight: 'medium' })}>Ingredients</p>
          <div className={css({ marginBlock: '3' })}>
            <Separator />
          </div>
          <p className={css({ color: 'muted-foreground', fontSize: 'sm' })}>Serves four people.</p>
        </div>
      </StorySection>
      <StorySection title="Vertical">
        <div className={css({ alignItems: 'center', display: 'flex', fontSize: 'sm', gap: '3', height: '8' })}>
          <span>Overview</span>
          <Separator orientation="vertical" />
          <span>Details</span>
        </div>
      </StorySection>
    </div>
  ),
}
