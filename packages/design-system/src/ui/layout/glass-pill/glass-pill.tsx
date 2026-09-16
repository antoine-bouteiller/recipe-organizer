import type React from 'react'

import { glassPillRecipe, glassContentRecipe, glassSurfaceRecipe } from './glass-pill.css'

export type GlassPillProps = Pick<React.ComponentProps<'div'>, 'children'> & { on: boolean }

export const GlassPill = ({ children, on }: GlassPillProps): React.ReactElement => (
  <div className={glassPillRecipe()} data-slot="glass-pill">
    {/* Blur sits on an absolute child, not the box itself: backdrop-filter inside a sticky box smears during iOS momentum scroll. */}
    <div aria-hidden className={glassSurfaceRecipe({ visible: on })} />
    <div className={glassContentRecipe()}>{children}</div>
  </div>
)
