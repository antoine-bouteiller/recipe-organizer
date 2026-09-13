import type React from 'react'

import { type IconProps } from './types'

export const TextItalicIcon = (props: IconProps): React.ReactElement => (
  <svg fill="none" height="1em" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M10.6667 4H20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
    <path d="M7.99872 20L15.9987 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
    <path d="M3.99872 20L13.3321 20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
  </svg>
)
