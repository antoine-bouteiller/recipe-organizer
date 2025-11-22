import { createFormHookContexts } from '@tanstack/react-form'
import { createContext } from 'react'

interface FormItemContextValue {
  id: string
}

export const FormItemContext = createContext<FormItemContextValue>({} as FormItemContextValue)

const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts()

export { fieldContext, formContext, useFieldContext, useFormContext }
