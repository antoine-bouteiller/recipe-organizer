import { type Meta, type StoryObj } from '@storybook/react-vite'

import { StorySection } from '../../../../.storybook/story-section'
import { Badge } from './badge'

import { container, container2, container3, overlayPreview } from './badge.stories.css'

const meta = {
  component: Badge,
  title: 'Data Display/Badge',
} satisfies Meta<typeof Badge>
export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  args: { children: 'New' },
  render: (args) => (
    <div className={container}>
      <StorySection title="Default">
        <Badge {...args} />
      </StorySection>
      <StorySection title="Variants">
        <div className={container2}>
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="accent">Accent</Badge>
          <Badge variant="eyebrow">Featured</Badge>
          <Badge variant="overlay">Overlay</Badge>
        </div>
      </StorySection>
      <StorySection title="Overlay contrast · light and dark themes">
        <div className={container2}>
          <div className={overlayPreview}>
            <Badge variant="overlay">On dark media</Badge>
          </div>
          <div className={`${overlayPreview} dark`}>
            <Badge variant="overlay">On dark media · dark theme</Badge>
          </div>
        </div>
      </StorySection>
      <StorySection title="Sizes">
        <div className={container3}>
          <Badge size="sm">Small</Badge>
          <Badge>Default</Badge>
        </div>
      </StorySection>
    </div>
  ),
}
