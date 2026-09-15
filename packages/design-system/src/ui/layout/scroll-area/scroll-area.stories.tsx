import { type Meta, type StoryObj } from '@storybook/react-vite'

import { StorySection } from '../../../../.storybook/story-section'
import { ScrollArea } from './scroll-area'

const meta = {
  component: ScrollArea,
  title: 'Layout/Scroll Area',
} satisfies Meta<typeof ScrollArea>

export default meta
type Story = StoryObj<typeof meta>

const content = Array.from({ length: 20 }, (_item, index) => `Recipe step ${index + 1}`)

export const Overview: Story = {
  render: () => (
    <div className="flex w-full min-w-0 flex-col gap-8">
      <StorySection title="Default">
        <ScrollArea className="h-56 w-80 rounded-md border p-4">
          <div className="grid gap-3 text-sm">
            {content.map((step) => (
              <p key={step}>{step}</p>
            ))}
          </div>
        </ScrollArea>
      </StorySection>
      <StorySection title="With Fade and Gutter">
        <ScrollArea className="h-56 w-80 rounded-md border p-4" scrollFade scrollbarGutter>
          <div className="grid gap-3 text-sm">
            {content.map((step) => (
              <p key={step}>{step}</p>
            ))}
          </div>
        </ScrollArea>
      </StorySection>
    </div>
  ),
}
