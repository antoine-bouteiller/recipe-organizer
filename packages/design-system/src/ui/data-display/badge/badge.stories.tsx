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
    <div className="flex w-full min-w-0 flex-col gap-8">
      <StorySection title="Default">
        <Badge {...args} />
      </StorySection>
      <StorySection title="Variants">
        <div className="flex flex-wrap items-center gap-3">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="accent">Accent</Badge>
          <Badge variant="eyebrow">Featured</Badge>
          <Badge variant="overlay">Overlay</Badge>
        </div>
      </StorySection>
      <StorySection title="Sizes">
        <div className="flex items-center gap-3">
          <Badge size="sm">Small</Badge>
          <Badge>Default</Badge>
        </div>
      </StorySection>
    </div>
  ),
}
