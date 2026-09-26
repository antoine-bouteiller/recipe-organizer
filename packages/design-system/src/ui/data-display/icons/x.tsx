import type React from 'react'

import { Icon } from './icon'
import type { IconProps } from './types'

export const XIcon = (props: IconProps): React.ReactElement => (
  <Icon {...props}>
    <path d="M18 6L6.00081 17.9992M17.9992 18L6 6.00085" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
  </Icon>
)
