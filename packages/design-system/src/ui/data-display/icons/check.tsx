import type React from 'react'

import { Icon } from './icon'
import { type IconProps } from './types'

export const CheckIcon = ({ weight, ...props }: IconProps & { weight?: 'bold' }): React.ReactElement => (
  <Icon {...props}>
    <path d="M5 14L8.5 17.5L19 6.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={weight === 'bold' ? 2.5 : 1.5} />
  </Icon>
)
