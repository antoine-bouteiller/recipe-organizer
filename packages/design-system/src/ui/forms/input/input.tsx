import type React from 'react'

import * as surface from './input-surface.css'
import * as styles from './input.css'

export type InputProps = Pick<
  React.ComponentProps<'input'>,
  'aria-invalid' | 'aria-label' | 'defaultValue' | 'disabled' | 'id' | 'onChange' | 'placeholder' | 'type' | 'value'
>

export const Input = (props: InputProps): React.ReactElement => (
  <span className={surface.inputSurface} data-slot="input-control">
    <input {...props} className={styles.input} data-slot="input" />
  </span>
)
