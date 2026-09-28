import { createContext } from 'react'
import type React from 'react'

import * as styles from './form.css'

const noErrors: Record<string, string> = {}
export const FormErrorsContext = createContext(noErrors)

export type FormProps = Pick<React.ComponentProps<'form'>, 'children' | 'onSubmit'> & { errors?: Record<string, string> }

export const Form = ({ children, errors, onSubmit }: FormProps): React.ReactElement => (
  <form className={styles.form} data-slot="form" noValidate onSubmit={onSubmit}>
    <FormErrorsContext value={errors ?? noErrors}>{children}</FormErrorsContext>
  </form>
)
