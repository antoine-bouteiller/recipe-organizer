import { Slot } from '@radix-ui/react-slot'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { FormItemContext, useFieldContext, useFormContext } from '@/hooks/use-form-context'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { useId, type ComponentProps } from 'react'

const FormItem = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const id = useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div data-slot="form-item" className={cn('grid gap-2', className)} {...props} />
    </FormItemContext.Provider>
  )
}

const FormLabel = ({ className, ...props }: React.ComponentProps<typeof Label>) => {
  const { formItemId, errors } = useFieldContext()

  return (
    <Label
      data-slot="form-label"
      data-error={errors.length > 0}
      className={cn('data-[error=true]:text-destructive', className)}
      htmlFor={formItemId}
      {...props}
    />
  )
}

const FormControl = ({ ...props }: ComponentProps<typeof Slot>) => {
  const { errors, formItemId, formDescriptionId, formMessageId } = useFieldContext()

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        errors.length === 0 ? formDescriptionId : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={errors.length > 0}
      {...props}
    />
  )
}

const FormDescription = ({ className, ...props }: React.ComponentProps<'p'>) => {
  const { formDescriptionId } = useFieldContext()

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

const FormMessage = ({ className, ...props }: React.ComponentProps<'p'>) => {
  const { errors, formMessageId } = useFieldContext()
  const body = errors.length > 0 ? String(errors.at(0)?.message ?? '') : props.children
  if (!body) {
    return undefined
  }

  return (
    <p
      data-slot="form-message"
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
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {label}
        </Button>
      )}
    </form.Subscribe>
  )
}

export { FormControl, FormDescription, FormItem, FormLabel, FormMessage, FormSubmit }
