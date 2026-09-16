import type React from 'react'

import { Icon } from './icon'
import { type IconProps } from './types'

export const ArrowElbowDownLeftIcon = (props: IconProps): React.ReactElement => (
  <Icon {...props}>
    <path
      d="M11 6H15.5C17.9853 6 20 8.01472 20 10.5C20 12.9853 17.9853 15 15.5 15H4"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
    <path
      d="M6.99998 12C6.99998 12 4.00001 14.2095 4 15C3.99999 15.7906 7 18 7 18"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
  </Icon>
)
