import type React from 'react'

import { type IconProps } from './types'

export const MagnifyingGlassIcon = ({ weight, ...props }: IconProps & { weight?: 'bold' }): React.ReactElement => (
  <svg fill="none" height="1em" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M17 17L21 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={weight === 'bold' ? 2.5 : 1.5} />
    <path
      d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={weight === 'bold' ? 2.5 : 1.5}
    />
  </svg>
)
