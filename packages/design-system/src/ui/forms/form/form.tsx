import { Form as FormPrimitive } from '@base-ui/react/form'
import type React from 'react'

import { formClassName } from './form.css'

export type FormProps = Pick<FormPrimitive.Props, 'children' | 'errors' | 'noValidate' | 'onSubmit'>

export const Form = ({ children, errors, noValidate, onSubmit }: FormProps): React.ReactElement => (
  <FormPrimitive className={formClassName} data-slot="form" errors={errors} noValidate={noValidate} onSubmit={onSubmit}>
    {children}
  </FormPrimitive>
)
