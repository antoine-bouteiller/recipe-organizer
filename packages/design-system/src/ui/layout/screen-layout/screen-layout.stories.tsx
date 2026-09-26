import { Button } from '@recipe-organizer/design-system/button'
import { withRouter } from '@storybook-helpers/router'
import { StorySection } from '@storybook-helpers/story-section'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useLocation } from '@tanstack/react-router'
import type { ComponentProps } from 'react'
import { expect, userEvent, within } from 'storybook/test'

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
  const pathname = useLocation({ select: (location) => location.pathname })
  return (
    <LayoutExample withGoBack title="Details">
      {pathname === '/' && <p role="status">Back action requested.</p>}
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
  decorators: [withRouter],
  parameters: { layout: 'padded', router: { initialEntries: ['/', '/settings'] } },
  title: 'Layout/Screen Layout',
} satisfies Meta<typeof ScreenLayout>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: (args) => (
    <div className={styles.storyLayout}>
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

export const Mobile: Story = {
  ...Overview,
  globals: { viewport: { isRotated: false, value: 'mobile2' } },
}

export const Interaction: Story = {
  ...Mobile,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const backSection = within(canvas.getByRole('region', { name: 'With back action' }))

    await userEvent.click(backSection.getByRole('button', { name: 'Retour' }))
    await expect(backSection.getByRole('status')).toHaveTextContent('Back action requested.')
  },
  tags: ['!dev'],
}
