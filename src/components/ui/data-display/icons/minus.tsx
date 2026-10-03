import type React from 'react'

import { Icon } from './icon'
import type { IconProps } from './types'

export const MinusIcon = ({ weight, ...props }: IconProps & { weight?: 'bold' }): React.ReactElement => (
  <Icon {...props}>
    <path d="M20 12L4 12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={weight === 'bold' ? 2.5 : 1.5} />
  </Icon>
)
