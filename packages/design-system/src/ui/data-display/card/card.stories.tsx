import { type Meta, type StoryObj } from '@storybook/react-vite'

import { StorySection } from '../../../../.storybook/story-section'
import { Button } from '../../actions/button/button'
import { Card } from './card'

const meta = {
  component: Card,
  title: 'Data Display/Card',
} satisfies Meta<typeof Card>
export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  args: {
    children: <div className="p-6 pt-0 text-sm">Card content goes here.</div>,
    description: 'A concise description of this content.',
    title: 'Recipe details',
  },
  render: (args) => (
    <div className="flex w-full min-w-0 flex-col gap-8">
      <StorySection title="Default">
        <Card {...args} />
      </StorySection>
      <StorySection title="With Actions">
        <Card description="Changes are saved automatically." title="Profile settings">
          <div className="flex items-center justify-end gap-3 p-6 pt-0">
            <Button variant="outline">Cancel</Button>
            <Button>Save changes</Button>
          </div>
        </Card>
      </StorySection>
      <StorySection title="Content Only">
        <Card>
          <div className="p-6 text-sm">A card can be used without a header.</div>
        </Card>
      </StorySection>
    </div>
  ),
}
