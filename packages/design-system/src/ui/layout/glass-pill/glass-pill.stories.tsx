import { type Meta, type StoryObj } from '@storybook/react-vite'
import { useState, type ReactElement } from 'react'

import { Button } from '../../actions/button/button'
import { GlassPill } from './glass-pill'

const GlassPillExample = (): ReactElement => {
  const [on, setOn] = useState(true)

  return (
    <div className="space-y-3 rounded-xl bg-gradient-to-br from-primary/30 via-background to-muted p-6">
      <GlassPill className="px-4 py-2" on={on}>
        <p className="font-medium">{on ? 'Filters are visible' : 'Filters are hidden'}</p>
      </GlassPill>
      <Button aria-pressed={on} onClick={() => setOn((visible) => !visible)} variant="outline">
        Toggle glass surface
      </Button>
    </div>
  )
}

const meta = {
  component: GlassPillExample,
  tags: ['autodocs'],
  title: 'Layout/GlassPill',
} satisfies Meta<typeof GlassPillExample>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
