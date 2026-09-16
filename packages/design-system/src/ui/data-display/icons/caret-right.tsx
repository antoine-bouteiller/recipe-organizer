import type React from 'react'

import { Icon } from './icon'
import { type IconProps } from './types'

export const CaretRightIcon = (props: IconProps): React.ReactElement => (
  <Icon {...props}>
    <path
      d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
  </Icon>
)
