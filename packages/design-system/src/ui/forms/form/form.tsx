import { Form as FormPrimitive } from '@base-ui/react/form'
import { css } from '@recipe-organizer/design-system/css'
import type React from 'react'

const formClassName = css({ display: 'flex', flexDirection: 'column', gap: '4', width: 'full' })

export type FormProps = Pick<FormPrimitive.Props, 'children' | 'errors' | 'noValidate' | 'onSubmit'>

export const Form = ({ children, errors, noValidate, onSubmit }: FormProps): React.ReactElement => (
  <FormPrimitive className={formClassName} data-slot="form" errors={errors} noValidate={noValidate} onSubmit={onSubmit}>
    {children}
  </FormPrimitive>
)
