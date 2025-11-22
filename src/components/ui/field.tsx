import { Field as FieldPrimitive } from '@base-ui-components/react/field'

import { useFormContext } from '@/hooks/use-form-context'
import { cn } from '@/utils/cn'
import { Button } from './button'
import { Spinner } from './spinner'

const Field = ({ className, ...props }: FieldPrimitive.Root.Props) => (
  <FieldPrimitive.Root
    className={cn('flex flex-col items-start gap-2', className)}
    data-slot="field"
    {...props}
  />
)

const FieldLabel = ({ className, ...props }: FieldPrimitive.Label.Props) => (
  <FieldPrimitive.Label
    className={cn('inline-flex items-center gap-2 text-sm/4', className)}
    data-slot="field-label"
    {...props}
  />
)

const FieldDescription = ({ className, ...props }: FieldPrimitive.Description.Props) => (
  <FieldPrimitive.Description
    className={cn('text-muted-foreground text-xs', className)}
    data-slot="field-description"
    {...props}
  />
)

const FieldError = ({ className, ...props }: FieldPrimitive.Error.Props) => (
  <FieldPrimitive.Error
    className={cn('text-destructive-foreground text-xs', className)}
    data-slot="field-error"
    {...props}
  />
)
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

const FieldControl = FieldPrimitive.Control
const FieldValidity = FieldPrimitive.Validity

export { Field, FieldControl, FieldDescription, FieldError, FieldLabel, FieldValidity, FormSubmit }
