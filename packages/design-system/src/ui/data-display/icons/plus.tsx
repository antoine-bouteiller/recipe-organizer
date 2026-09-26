import type React from 'react'

import { Icon } from './icon'
import type { IconProps } from './types'

export const PlusIcon = ({ weight, ...props }: IconProps & { weight?: 'bold' }): React.ReactElement => (
  <Icon {...props}>
    <path d="M12 4V20M20 12H4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={weight === 'bold' ? 2.5 : 1.5} />
  </Icon>
)
