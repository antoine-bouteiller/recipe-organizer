import { css } from '@recipe-organizer/design-system/css'
import { type Meta, type StoryObj } from '@storybook/react-vite'

import { StorySection } from '../../../../.storybook/story-section'
import { Badge } from './badge'

const meta = {
  component: Badge,
  title: 'Data Display/Badge',
} satisfies Meta<typeof Badge>
export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  args: { children: 'New' },
  render: (args) => (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '8', minWidth: '0', width: 'full' })}>
      <StorySection title="Default">
        <Badge {...args} />
      </StorySection>
      <StorySection title="Variants">
        <div className={css({ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: '3' })}>
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="accent">Accent</Badge>
          <Badge variant="eyebrow">Featured</Badge>
          <Badge variant="overlay">Overlay</Badge>
        </div>
      </StorySection>
      <StorySection title="Sizes">
        <div className={css({ alignItems: 'center', display: 'flex', gap: '3' })}>
          <Badge size="sm">Small</Badge>
          <Badge>Default</Badge>
        </div>
      </StorySection>
    </div>
  ),
}
