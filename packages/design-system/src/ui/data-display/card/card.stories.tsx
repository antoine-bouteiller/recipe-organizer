import { type Meta, type StoryObj } from '@storybook/react-vite'

import { StorySection } from '../../../../.storybook/story-section'
import { Button } from '../../actions/button/button'
import { Card } from './card'

import { container, container2, container3, container4 } from './card.stories.css'

const meta = {
  component: Card,
  title: 'Data Display/Card',
} satisfies Meta<typeof Card>
export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  args: {
    children: <div className={container}>Card content goes here.</div>,
    description: 'A concise description of this content.',
    title: 'Recipe details',
  },
  render: (args) => (
    <div className={container2}>
      <StorySection title="Default">
        <Card {...args} />
      </StorySection>
      <StorySection title="With Actions">
        <Card description="Changes are saved automatically." title="Profile settings">
          <div className={container3}>
            <Button variant="outline">Cancel</Button>
            <Button>Save changes</Button>
          </div>
        </Card>
      </StorySection>
      <StorySection title="Content Only">
        <Card>
          <div className={container4}>A card can be used without a header.</div>
        </Card>
      </StorySection>
    </div>
  ),
}
