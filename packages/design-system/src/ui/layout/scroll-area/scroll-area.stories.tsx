import { type Meta, type StoryObj } from '@storybook/react-vite'
import { expect, waitFor, within } from 'storybook/test'

import { StorySection } from '../../../../.storybook/story-section'
import { ScrollArea } from './scroll-area'

import { container, container2, container3, container4, container5, container6, container7 } from './scroll-area.stories.css'

const meta = {
  component: ScrollArea,
  title: 'Layout/Scroll Area',
} satisfies Meta<typeof ScrollArea>

export default meta
type Story = StoryObj<typeof meta>

const content = Array.from({ length: 20 }, (_item, index) => `Recipe step ${index + 1}`)

export const Overview: Story = {
  play: async ({ canvasElement }) => {
    const root = within(canvasElement).getByLabelText('Compact scrolling')
    const viewport = root.querySelector('[data-slot=scroll-area-viewport]')
    await waitFor(() => expect(viewport).toHaveAttribute('data-has-overflow-y'))
  },
  render: () => (
    <div className={container}>
      <StorySection title="Default">
        <div className={container2}>
          <ScrollArea>
            <div className={container3}>
              {content.map((step) => (
                <p key={step}>{step}</p>
              ))}
            </div>
          </ScrollArea>
        </div>
      </StorySection>
      <StorySection title="With Fade and Gutter">
        <div className={container4}>
          <ScrollArea scrollFade scrollbarGutter>
            <div className={container5}>
              {content.map((step) => (
                <p key={step}>{step}</p>
              ))}
            </div>
          </ScrollArea>
        </div>
      </StorySection>
      <StorySection title="Fade without overflow">
        <div className={container4}>
          <ScrollArea scrollFade>
            <div className={container5}>Short content stays visible without scrolling.</div>
          </ScrollArea>
        </div>
      </StorySection>
      <StorySection title="Compact Gutter">
        <div className={container6}>
          <ScrollArea aria-label="Compact scrolling" scrollbarGutter="compact" scrollFade>
            <div className={container7}>
              {content.map((step) => (
                <p key={step}>{step}</p>
              ))}
            </div>
          </ScrollArea>
        </div>
      </StorySection>
    </div>
  ),
}
