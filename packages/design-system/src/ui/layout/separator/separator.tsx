import { Separator as SeparatorPrimitive } from '@base-ui/react/separator'
import type React from 'react'

import * as styles from './separator.css'

export type SeparatorProps = Pick<SeparatorPrimitive.Props, 'orientation'>

export const Separator = ({ orientation = 'horizontal' }: SeparatorProps): React.ReactElement => (
  <SeparatorPrimitive className={styles.separator({ orientation })} data-slot="separator" orientation={orientation} />
)
