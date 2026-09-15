import { type Meta, type StoryObj } from '@storybook/react-vite'

import { StorySection } from '../../../../.storybook/story-section'
import { Button } from '../../actions/button/button'
import { CheckCircleIcon } from '../icons/check-circle'
import { Item, ItemGroup, ItemSeparator } from './item'

const meta = {
  component: Item,
  tags: ['autodocs'],
  title: 'Data Display/Item',
} satisfies Meta<typeof Item>
export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  args: {
    children: 'Keep this recipe in your collection.',
    media: <CheckCircleIcon />,
    title: 'Saved recipe',
  },
  render: (args) => (
    <div className="flex w-full min-w-0 flex-col gap-8">
      <StorySection title="Default">
        <Item {...args} />
      </StorySection>
      <StorySection title="Variants">
        <div className="grid gap-3">
          <Item media={<CheckCircleIcon />} title="Default">
            A standard item.
          </Item>
          <Item media={<CheckCircleIcon />} title="Muted" variant="muted">
            A subdued item.
          </Item>
          <Item media={<CheckCircleIcon />} title="Outline" variant="outline">
            An outlined item.
          </Item>
          <Item size="sm" title="Small item">
            A compact item.
          </Item>
        </div>
      </StorySection>
      <StorySection title="With Actions">
        <Item actions={<Button size="sm">View</Button>} media={<CheckCircleIcon />} title="Pasta primavera">
          Open the recipe to review its ingredients.
        </Item>
      </StorySection>
      <StorySection title="Group">
        <ItemGroup className="max-w-md rounded-md border">
          <Item title="First item">A grouped item.</Item>
          <ItemSeparator />
          <Item title="Second item">Another grouped item.</Item>
        </ItemGroup>
      </StorySection>
    </div>
  ),
}
