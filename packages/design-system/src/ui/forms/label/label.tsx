import type React from 'react'

import { labelClassName } from './label.css'

export type LabelProps = Pick<React.LabelHTMLAttributes<HTMLLabelElement>, 'children' | 'htmlFor'>

export const Label = ({ children, htmlFor }: LabelProps): React.ReactElement => (
  <label className={labelClassName} data-slot="label" htmlFor={htmlFor}>
    {children}
  </label>
)
