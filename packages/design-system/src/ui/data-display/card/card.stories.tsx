import { type Meta, type StoryObj } from '@storybook/react-vite'

import { Button } from '../../actions/button/button'
import { Card } from './card'

const meta = {
  component: Card,
  tags: ['autodocs'],
  title: 'Data Display/Card',
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: <div className="p-6 pt-0 text-sm">Card content goes here.</div>,
    description: 'A concise description of this content.',
    title: 'Recipe details',
  },
}

export const WithActions: Story = {
  render: () => (
    <Card description="Changes are saved automatically." title="Profile settings">
      <div className="flex items-center justify-end gap-3 p-6 pt-0">
        <Button variant="outline">Cancel</Button>
        <Button>Save changes</Button>
      </div>
    </Card>
  ),
}

export const ContentOnly: Story = {
  args: { children: <div className="p-6 text-sm">A card can be used without a header.</div> },
}
