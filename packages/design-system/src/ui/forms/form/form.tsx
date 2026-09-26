import { Form as FormPrimitive } from '@base-ui/react/form'
import type React from 'react'

import * as styles from './form.css'

export type FormProps = Pick<FormPrimitive.Props, 'children' | 'errors' | 'onSubmit'>

export const Form = ({ children, errors, onSubmit }: FormProps): React.ReactElement => (
  <FormPrimitive className={styles.form} data-slot="form" errors={errors} onSubmit={onSubmit}>
    {children}
  </FormPrimitive>
)
