import type React from 'react'

import { type IconProps } from './types'

export const ShoppingCartSimpleIcon = ({ weight, ...props }: IconProps & { weight?: 'fill' }): React.ReactElement => (
  <svg fill="none" height="1em" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    {weight === 'fill' ? (
      <>
        <path
          d="M5.25 5.25H21.85C22.32 5.25 22.68 5.67 22.6 6.14L21.11 11.85C20.75 15.02 19.83 15.77 16.78 16.02L7.65 16.79L5.25 5.25Z"
          fill="currentColor"
        />
        <path d="M4 20a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
        <path d="M15 20a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
        <path d="M8 20L15 20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
      </>
    ) : (
      <>
        <path
          d="M8 16L16.7201 15.2733C19.4486 15.046 20.0611 14.45 20.3635 11.7289L21 6"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
        />
        <path d="M6 6H22" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
        <path d="M4 20a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
        <path d="M15 20a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
        <path d="M8 20L15 20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
      </>
    )}
    <path
      d="M2 2H2.966C3.91068 2 4.73414 2.62459 4.96326 3.51493L7.93852 15.0765C8.08887 15.6608 7.9602 16.2797 7.58824 16.7616L6.63213 18"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
  </svg>
)
