import { type Meta, type StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { Button } from '../../actions/button/button'
import { ScreenLayout } from './screen-layout'

const content = (
  <section className="space-y-4 py-4">
    <h2 className="text-xl font-semibold">Content</h2>
    {Array.from({ length: 40 }, (_item, index) => (
      <p key={index}>Item {index + 1}</p>
    ))}
  </section>
)

const BackExample = () => {
  const [wentBack, setWentBack] = useState(false)
  return (
    <ScreenLayout onBack={() => setWentBack(true)} title="Details">
      {wentBack && <p role="status">Back action requested.</p>}
      {content}
    </ScreenLayout>
  )
}

const meta = {
  args: { children: content, innerScrollId: 'story-content', outerScrollId: 'story-outer', title: 'Library' },
  component: ScreenLayout,
  decorators: [
    (Story) => (
      <div className="flex h-dvh flex-col">
        <Story />
      </div>
    ),
  ],
  globals: { viewport: { isRotated: false, value: 'mobile2' } },
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  title: 'Layout/Screen Layout',
} satisfies Meta<typeof ScreenLayout>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const header = within(canvasElement).getByRole('heading', { name: 'Library' })
    const panel = canvasElement.querySelector<HTMLDivElement>('[data-scroll-restoration-id="story-content"]')
    await expect(panel).not.toBeNull()
    panel?.scrollTo({ top: 50 })
    await waitFor(() => expect(header).toHaveClass('text-base'))
    panel?.scrollTo({ top: 32 })
    await waitFor(() => expect(panel?.scrollTop).toBe(32))
    await expect(header).toHaveClass('text-base')
    panel?.scrollTo({ top: 24 })
    await waitFor(() => expect(header).toHaveClass('text-3xl'))
  },
}
export const Desktop: Story = { globals: { viewport: { isRotated: false, value: 'desktop' } } }
export const WithBackAction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Retour' }))
    await expect(canvas.getByRole('status')).toHaveTextContent('Back action requested.')
  },
  render: () => <BackExample />,
}
export const WithHeaderAction: Story = { args: { headerEndItem: <Button size="sm">Add item</Button> } }
export const WithFooter: Story = {
  args: {
    footer: (
      <nav aria-label="Example navigation" className="fixed bottom-0 flex h-14 w-full items-center justify-center border-t bg-background">
        Navigation slot
      </nav>
    ),
  },
}
export const WithBackgroundImage: Story = {
  args: {
    backgroundImage: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="640" height="360" fill="#0e6e7e"/></svg>')}`,
  },
}
