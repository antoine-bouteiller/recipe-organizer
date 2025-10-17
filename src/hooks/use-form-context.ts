import { createFormHookContexts } from '@tanstack/react-form'
import { createContext, useContext } from 'react'

interface FormItemContextValue {
  id: string
}

export const FormItemContext = createContext<FormItemContextValue>({} as FormItemContextValue)

const {
  fieldContext,
  formContext,
  useFieldContext: useFormFieldContext,
  useFormContext,
} = createFormHookContexts()

const useFieldContext = <T>() => {
  const { id } = useContext(FormItemContext)
  const { name, store, state, ...fieldContext } = useFormFieldContext<T>()

  if (!fieldContext) {
    throw new Error('useFormField should be used within <field.Container>')
  }

  return {
    id,
    name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    store,
    state,
    ...state.meta,
    ...fieldContext,
  }
}

export { fieldContext, formContext, useFieldContext, useFormContext, useFormFieldContext }
