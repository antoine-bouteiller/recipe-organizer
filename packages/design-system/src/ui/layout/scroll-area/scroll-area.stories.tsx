import { StorySection } from '@storybook-helpers/story-section'
import { type Meta, type StoryObj } from '@storybook/react-vite'

import { ScrollArea } from './scroll-area'

import * as styles from './scroll-area.stories.css'

const meta = {
  component: ScrollArea,
  title: 'Layout/Scroll Area',
} satisfies Meta<typeof ScrollArea>

export default meta
type Story = StoryObj<typeof meta>

const content = Array.from({ length: 20 }, (_item, index) => `Recipe step ${index + 1}`)

export const Overview: Story = {
  render: () => (
    <div className={styles.container}>
      <StorySection title="Default">
        <div className={styles.standardScrollFrame}>
          <ScrollArea>
            <div className={styles.standardScrollContent}>
              {content.map((step) => (
                <p key={step}>{step}</p>
              ))}
            </div>
          </ScrollArea>
        </div>
      </StorySection>
      <StorySection title="With Fade and Gutter">
        <div className={styles.fadeScrollFrame}>
          <ScrollArea scrollFade scrollbarGutter>
            <div className={styles.fadeScrollContent}>
              {content.map((step) => (
                <p key={step}>{step}</p>
              ))}
            </div>
          </ScrollArea>
        </div>
      </StorySection>
      <StorySection title="Fade without overflow">
        <div className={styles.fadeScrollFrame}>
          <ScrollArea scrollFade>
            <div className={styles.fadeScrollContent}>Short content stays visible without scrolling.</div>
          </ScrollArea>
        </div>
      </StorySection>
      <StorySection title="Compact Gutter">
        <div className={styles.compactScrollFrame}>
          <ScrollArea aria-label="Compact scrolling" scrollbarGutter="compact" scrollFade>
            <div className={styles.compactScrollContent}>
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
