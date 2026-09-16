import { css } from '@recipe-organizer/design-system/css'
import { type Meta, type StoryObj } from '@storybook/react-vite'
import { useState, type ReactElement } from 'react'

import { Button } from '../../actions/button/button'
import { GlassPill } from './glass-pill'

const GlassPillExample = (): ReactElement => {
  const [on, setOn] = useState(true)

  return (
    <div
      className={css({
        '& > * + *': { marginTop: '3' },
        background: 'linear-gradient(to bottom right, token(colors.primary/30), token(colors.background), token(colors.muted))',
        borderRadius: 'xl',
        padding: '6',
      })}
    >
      <div className={css({ paddingBlock: '2', paddingInline: '4', width: 'fit-content' })}>
        <GlassPill on={on}>
          <p className={css({ fontWeight: 'medium' })}>{on ? 'Filters are visible' : 'Filters are hidden'}</p>
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
