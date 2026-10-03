import type React from 'react'

import * as styles from './label.css'

export type LabelProps = Pick<React.LabelHTMLAttributes<HTMLLabelElement>, 'children' | 'htmlFor'>

export const Label = ({ children, htmlFor }: LabelProps): React.ReactElement => (
  <label className={styles.label} data-slot="label" htmlFor={htmlFor}>
    {children}
  </label>
)
