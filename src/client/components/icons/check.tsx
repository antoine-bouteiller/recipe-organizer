import type React from 'react'

import { type IconProps } from './types'

export const CheckIcon = ({ weight, ...props }: IconProps & { weight?: 'bold' }): React.ReactElement => (
  <svg fill="none" height="1em" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M5 14L8.5 17.5L19 6.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={weight === 'bold' ? 2.5 : 1.5} />
  </svg>
)
