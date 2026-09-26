import type React from 'react'

import { Icon } from './icon'
import type { IconProps } from './types'

export const TextItalicIcon = (props: IconProps): React.ReactElement => (
  <Icon {...props}>
    <path d="M10.6667 4H20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
    <path d="M7.99872 20L15.9987 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
    <path d="M3.99872 20L13.3321 20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
  </Icon>
)
