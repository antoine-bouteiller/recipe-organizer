import { cva } from '@recipe-organizer/design-system/css'
import type React from 'react'

const glassPillRecipe = cva({
  base: { pointerEvents: 'auto', position: 'relative' },
})

const glassContentRecipe = cva({ base: { position: 'relative' } })
const glassSurfaceRecipe = cva({
  base: {
    _motionReduce: { transition: 'none' },
    backdropFilter: 'blur(24px)',
    backgroundColor: 'background/80',
    borderColor: 'border/60',
    borderRadius: 'full',
    borderWidth: '1px',
    inset: '0',
    position: 'absolute',
    transition: 'opacity 200ms token(easings.out-snappy)',
  },
  defaultVariants: { visible: false },
  variants: { visible: { false: { opacity: 0 }, true: { opacity: 1 } } },
})

export type GlassPillProps = Pick<React.ComponentProps<'div'>, 'children'> & { on: boolean }

export const GlassPill = ({ children, on }: GlassPillProps): React.ReactElement => (
  <div className={glassPillRecipe()} data-slot="glass-pill">
    {/* Blur sits on an absolute child, not the box itself: backdrop-filter inside a sticky box smears during iOS momentum scroll. */}
    <div aria-hidden className={glassSurfaceRecipe({ visible: on })} />
    <div className={glassContentRecipe()}>{children}</div>
  </div>
)
