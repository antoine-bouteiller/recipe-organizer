import { type Meta, type StoryObj } from '@storybook/react-vite'

import { Separator } from './separator'

const meta = {
  component: Separator,
  tags: ['autodocs'],
  title: 'Layout/Separator',
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="w-80">
      <p className="text-sm font-medium">Ingredients</p>
      <Separator className="my-3" />
      <p className="text-sm text-muted-foreground">Serves four people.</p>
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div className="flex h-8 items-center gap-3 text-sm">
      <span>Overview</span>
      <Separator orientation="vertical" />
      <span>Details</span>
    </div>
  ),
}
