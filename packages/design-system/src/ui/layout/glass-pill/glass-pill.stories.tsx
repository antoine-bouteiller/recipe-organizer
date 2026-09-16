import { type Meta, type StoryObj } from '@storybook/react-vite'
import { useState, type ReactElement } from 'react'

import { Button } from '../../actions/button/button'
import { GlassPill } from './glass-pill'

import { container, container2, text } from './glass-pill.stories.css'

const GlassPillExample = (): ReactElement => {
  const [on, setOn] = useState(true)

  return (
    <div className={container}>
      <div className={container2}>
        <GlassPill on={on}>
          <p className={text}>{on ? 'Filters are visible' : 'Filters are hidden'}</p>
        </GlassPill>
      </div>
      <Button aria-pressed={on} onClick={() => setOn((visible) => !visible)} variant="outline">
        Toggle glass surface
      </Button>
    </div>
  )
}

const meta = {
  component: GlassPillExample,
  title: 'Layout/GlassPill',
} satisfies Meta<typeof GlassPillExample>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
