import { css } from '@recipe-organizer/design-system/css'
import { type Meta, type StoryObj } from '@storybook/react-vite'
import { expect, waitFor, within } from 'storybook/test'

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
  play: async ({ canvasElement }) => {
    const root = within(canvasElement).getByLabelText('Compact scrolling')
    const viewport = root.querySelector('[data-slot=scroll-area-viewport]')
    await waitFor(() => expect(viewport).toHaveAttribute('data-has-overflow-y'))
  },
  render: () => (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '8', minWidth: '0', width: 'full' })}>
      <StorySection title="Default">
        <div className={css({ borderColor: 'border', borderRadius: 'md', borderWidth: '1px', height: '56', padding: '4', width: '80' })}>
          <ScrollArea>
            <div className={css({ display: 'grid', fontSize: 'sm', gap: '3' })}>
              {content.map((step) => (
                <p key={step}>{step}</p>
              ))}
            </div>
          </ScrollArea>
        </div>
      </StorySection>
      <StorySection title="With Fade and Gutter">
        <div className={css({ borderColor: 'border', borderRadius: 'md', borderWidth: '1px', height: '56', padding: '4', width: '80' })}>
          <ScrollArea scrollFade scrollbarGutter>
            <div className={css({ display: 'grid', fontSize: 'sm', gap: '3' })}>
              {content.map((step) => (
                <p key={step}>{step}</p>
              ))}
            </div>
          </ScrollArea>
        </div>
      </StorySection>
      <StorySection title="Compact Gutter">
        <div className={css({ height: '56', width: '80' })}>
          <ScrollArea aria-label="Compact scrolling" scrollbarGutter="compact" scrollFade>
            <div className={css({ display: 'grid', fontSize: 'sm', gap: '3' })}>
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
