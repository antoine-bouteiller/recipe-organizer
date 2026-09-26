import type React from 'react'

import { Icon } from './icon'
import type { IconProps } from './types'

export const CaretUpIcon = (props: IconProps): React.ReactElement => (
  <Icon {...props}>
    <path
      d="M17.9998 15C17.9998 15 13.5809 9.00001 11.9998 9C10.4187 8.99999 5.99985 15 5.99985 15"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
  </Icon>
)
