import { useRender } from '@base-ui-components/react/use-render'

import { Label } from '@/components/ui/label'
import { FormItemContext, useFieldContext, useFormContext } from '@/hooks/use-form-context'
import { cn } from '@/lib/utils'
import { useId, useMemo } from 'react'
import { Button } from '../ui/button'
import { Spinner } from '../ui/spinner'

const FormItem = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const id = useId()
  const contextValue = useMemo(() => ({ id }), [id])

  return (
    <FormItemContext.Provider value={contextValue}>
      <div data-slot="form-item" className={cn('grid gap-2', className)} {...props} />
    </FormItemContext.Provider>
  )
}

const FieldLabel = ({ className, ...props }: React.ComponentProps<typeof Label>) => {
  const { formItemId, isValid } = useFieldContext()

  return (
    <Label
      data-slot="field-label"
      data-error={!isValid}
      className={cn('data-[error=true]:text-destructive', className)}
      htmlFor={formItemId}
      {...props}
    />
  )
}

const FieldControl = ({ children = <div /> }: { children?: useRender.RenderProp }) => {
  const { formItemId, isValid, formDescriptionId, formMessageId } = useFieldContext()

  return useRender({
    render: children,
    props: {
      'data-slot': 'field-control',
      'id': formItemId,
      'aria-describedby': isValid ? formDescriptionId : `${formDescriptionId} ${formMessageId}`,
      'aria-invalid': !isValid,
    },
  })
}

const FieldDescription = ({ className, ...props }: React.ComponentProps<'p'>) => {
  const { formDescriptionId } = useFieldContext()

  return (
    <p
      data-slot="field-description"
      id={formDescriptionId}
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

const FieldMessage = ({ className, ...props }: React.ComponentProps<'p'>) => {
  const { formMessageId, isValid, errors } = useFieldContext()

  if (props.children) {
    return props.children
  }

  const body = isValid
    ? props.children
    : String(errors.map((error) => error.message).join(', ') ?? '')

  if (!body) {
    return undefined
  }

  return (
    <p
      data-slot="field-message"
      id={formMessageId}
      className={cn('text-destructive text-sm', className)}
      {...props}
    >
      {body}
    </p>
  )
}

const FormSubmit = ({ label }: { label: string }) => {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Spinner />}
          {label}
        </Button>
      )}
    </form.Subscribe>
  )
}

export { FieldControl, FieldDescription, FieldLabel, FieldMessage, FormItem, FormSubmit }
