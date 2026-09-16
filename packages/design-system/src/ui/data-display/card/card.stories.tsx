import { css } from '@recipe-organizer/design-system/css'
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
    children: <div className={css({ fontSize: 'sm', padding: '6', paddingTop: '0' })}>Card content goes here.</div>,
    description: 'A concise description of this content.',
    title: 'Recipe details',
  },
  render: (args) => (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '8', minWidth: '0', width: 'full' })}>
      <StorySection title="Default">
        <Card {...args} />
      </StorySection>
      <StorySection title="With Actions">
        <Card description="Changes are saved automatically." title="Profile settings">
          <div className={css({ alignItems: 'center', display: 'flex', gap: '3', justifyContent: 'flex-end', padding: '6', paddingTop: '0' })}>
            <Button variant="outline">Cancel</Button>
            <Button>Save changes</Button>
          </div>
        </Card>
      </StorySection>
      <StorySection title="Content Only">
        <Card>
          <div className={css({ fontSize: 'sm', padding: '6' })}>A card can be used without a header.</div>
        </Card>
      </StorySection>
    </div>
  ),
}
