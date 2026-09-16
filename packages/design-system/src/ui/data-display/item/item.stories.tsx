import { css } from '@recipe-organizer/design-system/css'
import { type Meta, type StoryObj } from '@storybook/react-vite'

import { StorySection } from '../../../../.storybook/story-section'
import { Button } from '../../actions/button/button'
import { CheckCircleIcon } from '../icons/check-circle'
import { Item, ItemGroup, ItemSeparator } from './item'

const meta = {
  component: Item,
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
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '8', minWidth: '0', width: 'full' })}>
      <StorySection title="Default">
        <Item {...args} />
      </StorySection>
      <StorySection title="Variants">
        <div className={css({ display: 'grid', gap: '3' })}>
          <Item media={<CheckCircleIcon />} title="Default">
            A standard item.
          </Item>
          <Item media={<CheckCircleIcon />} title="Outline" variant="outline">
            An outlined item.
          </Item>
        </div>
      </StorySection>
      <StorySection title="Row layout">
        <Item actions={<Button size="sm">View</Button>} layout="row" media={<CheckCircleIcon />} title="Pasta primavera">
          Open the recipe to review its ingredients.
        </Item>
      </StorySection>
      <StorySection title="Group">
        <ItemGroup>
          <Item title="First item">A grouped item.</Item>
          <ItemSeparator />
          <Item title="Second item">Another grouped item.</Item>
        </ItemGroup>
      </StorySection>
    </div>
  ),
}
