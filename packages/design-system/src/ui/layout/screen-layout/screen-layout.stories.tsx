import { type Meta, type StoryObj } from '@storybook/react-vite'
import { type ComponentProps, useState } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { StorySection } from '../../../../.storybook/story-section'
import { Button } from '../../actions/button/button'
import { ScreenLayout } from './screen-layout'

import * as styles from './screen-layout.stories.css'

const content = (
  <section className={styles.section}>
    <h2 className={styles.heading}>Content</h2>
    {Array.from({ length: 40 }, (_item, index) => (
      <p key={index}>Item {index + 1}</p>
    ))}
  </section>
)

const BackExample = () => {
  const [wentBack, setWentBack] = useState(false)
  return (
    <LayoutExample onBack={() => setWentBack(true)} title="Details">
      {wentBack && <p role="status">Back action requested.</p>}
      {content}
    </LayoutExample>
  )
}

const LayoutExample = (props: ComponentProps<typeof ScreenLayout>) => (
  <div className={styles.container}>
    <ScreenLayout {...props} />
  </div>
)

const meta = {
  args: { children: content, title: 'Library' },
  component: ScreenLayout,
  parameters: { layout: 'padded' },
  title: 'Layout/Screen Layout',
} satisfies Meta<typeof ScreenLayout>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const section = canvas.getByRole('region', { name: 'Default' })
    const panel = section.querySelector<HTMLDivElement>('[data-scroll-restoration-id="story-content"]')
    await expect(panel).not.toBeNull()
    // The sticky header and back button are mobile-only.
    if (globalThis.matchMedia('(max-width: 767px)').matches) {
      const header = within(section).getByRole('heading', { name: 'Library' })
      const headerTop = header.getBoundingClientRect().top
      panel?.scrollTo({ top: 50 })
      await waitFor(() => expect(panel?.scrollTop).toBe(50))
      await expect(header).toBeVisible()
      await expect(header.getBoundingClientRect().top).toBe(headerTop)
      await expect(header).not.toHaveAttribute('data-scrolled')
      panel?.scrollTo({ top: 0 })
      const backSection = within(canvas.getByRole('region', { name: 'With back action' }))
      await userEvent.click(backSection.getByRole('button', { name: 'Retour' }))
      await expect(backSection.getByRole('status')).toHaveTextContent('Back action requested.')
    } else {
      const outer = section.querySelector<HTMLDivElement>('[data-scroll-restoration-id="story-outer"]')
      await expect(outer).not.toBeNull()
      outer?.scrollTo({ top: 50 })
      await waitFor(() => expect(outer?.scrollTop).toBe(50))
      await expect(within(section).getByText('Library')).not.toBeVisible()
      outer?.scrollTo({ top: 0 })
    }
  },
  render: (args) => (
    <div className={styles.container2}>
      <p className={styles.text}>Use the viewport toolbar to compare mobile headers and desktop scrolling.</p>
      <StorySection title="Default">
        <LayoutExample {...args} innerScrollId="story-content" outerScrollId="story-outer" />
      </StorySection>
      <StorySection title="With back action">
        <BackExample />
      </StorySection>
      <StorySection title="With header action">
        <LayoutExample {...args} headerEndItem={<Button size="sm">Add item</Button>} />
      </StorySection>
      <StorySection title="With long title">
        <LayoutExample {...args} title="A long recipe collection title that should truncate" headerEndItem={<Button size="sm">Add item</Button>} />
      </StorySection>
      <StorySection title="With footer">
        <LayoutExample
          {...args}
          footer={
            <nav aria-label="Example navigation" className={styles.element}>
              Navigation slot
            </nav>
          }
        />
      </StorySection>
      <StorySection title="With background image">
        <LayoutExample
          {...args}
          backgroundImage={`data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="640" height="360" fill="#0e6e7e"/></svg>')}`}
        />
      </StorySection>
    </div>
  ),
}
