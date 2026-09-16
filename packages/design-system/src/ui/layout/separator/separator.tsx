import { Separator as SeparatorPrimitive } from '@base-ui/react/separator'
import { cva } from '@recipe-organizer/design-system/css'
import type React from 'react'

const separatorRecipe = cva({
  base: { backgroundColor: 'border', flexShrink: '0' },
  defaultVariants: { orientation: 'horizontal' },
  variants: {
    orientation: {
      horizontal: { height: '1px', width: 'full' },
      vertical: { alignSelf: 'stretch', width: '1px' },
    },
  },
})

export type SeparatorProps = Pick<SeparatorPrimitive.Props, 'orientation'>

export const Separator = ({ orientation = 'horizontal' }: SeparatorProps): React.ReactElement => (
  <SeparatorPrimitive className={separatorRecipe({ orientation })} data-slot="separator" orientation={orientation} />
)
