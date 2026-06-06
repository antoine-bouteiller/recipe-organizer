import { Form as FormPrimitive } from '@base-ui/react/form'
import type React from 'react'

import { cn } from '@/utils/cn'

export const Form = ({ className, ...props }: FormPrimitive.Props): React.ReactElement => (
  <FormPrimitive className={cn('flex w-full flex-col gap-4', className)} data-slot="form" {...props} />
)

export { FormPrimitive }
