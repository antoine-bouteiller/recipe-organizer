import type React from 'react'

import { type IconProps } from './types'

export const CowIcon = (props: IconProps): React.ReactElement => (
  <svg fill="none" height="1em" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M6.0000599999999995 10a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
    <path
      d="M2 10C2 13.3137 4.68629 16 8 16C9.05861 16 10.0532 15.7258 10.9166 15.2447C13.1893 13.9781 14.0001 13 18 12C20.2318 11.442 22 10.2091 22 8C22 5.79086 20.2091 4 18 4H8C4.68629 4 2 6.68629 2 10Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
    <path
      d="M2.00012 10L2 14C2 17.3137 4.68629 20 8 20C9.05861 20 10.0532 19.7258 10.9166 19.2447C13.1893 17.9781 14.0001 17 18 16C20.2318 15.442 22 14.2091 22 12V8"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
  </svg>
)
