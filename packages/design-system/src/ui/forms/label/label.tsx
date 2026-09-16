import { css } from '@recipe-organizer/design-system/css'
import type React from 'react'

const labelClassName = css({
  alignItems: 'center',
  color: 'foreground',
  display: 'inline-flex',
  fontSize: { base: 'base', sm: 'sm' },
  fontWeight: 'medium',
  gap: '2',
  lineHeight: { base: '1.125rem', sm: '1rem' },
})
export type LabelProps = Pick<React.LabelHTMLAttributes<HTMLLabelElement>, 'children' | 'htmlFor'>

export const Label = ({ children, htmlFor }: LabelProps): React.ReactElement => (
  <label className={labelClassName} data-slot="label" htmlFor={htmlFor}>
    {children}
  </label>
)
