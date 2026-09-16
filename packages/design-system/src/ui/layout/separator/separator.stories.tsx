import { type Meta, type StoryObj } from '@storybook/react-vite'

import { StorySection } from '../../../../.storybook/story-section'
import { Separator } from './separator'

import { container, container2, text, container3, text2, container4 } from './separator.stories.css'

const meta = {
  component: Separator,
  title: 'Layout/Separator',
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: () => (
    <div className={container}>
      <StorySection title="Default">
        <div className={container2}>
          <p className={text}>Ingredients</p>
          <div className={container3}>
            <Separator />
          </div>
          <p className={text2}>Serves four people.</p>
        </div>
      </StorySection>
      <StorySection title="Vertical">
        <div className={container4}>
          <span>Overview</span>
          <Separator orientation="vertical" />
          <span>Details</span>
        </div>
      </StorySection>
    </div>
  ),
}
