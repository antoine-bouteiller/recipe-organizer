import { Separator as SeparatorPrimitive } from '@base-ui/react/separator'
import type React from 'react'

import { separatorRecipe } from './separator.css'

export type SeparatorProps = Pick<SeparatorPrimitive.Props, 'orientation'>

export const Separator = ({ orientation = 'horizontal' }: SeparatorProps): React.ReactElement => (
  <SeparatorPrimitive className={separatorRecipe({ orientation })} data-slot="separator" orientation={orientation} />
)
