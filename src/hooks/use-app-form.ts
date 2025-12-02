import { createFormHook } from '@tanstack/react-form'

import { ComboboxField } from '@/components/forms/combobox-field'
import { ImageField } from '@/components/forms/image-field'
import { NumberField } from '@/components/forms/number-field'
import { SelectField } from '@/components/forms/select-field'
import { TextField } from '@/components/forms/text-field'
import TiptapField from '@/components/forms/tiptap-field'
import { Field, FieldControl, FieldDescription, FieldError, FieldLabel, FormSubmit } from '@/components/ui/field'
import { fieldContext, formContext } from '@/hooks/use-form-context'

const { useAppForm, withFieldGroup, withForm } = createFormHook({
  fieldComponents: {
    ComboboxField,
    Field,
    FieldControl,
    FieldDescription,
    FieldError,
    FieldLabel,
    ImageField,
    NumberField,
    SelectField,
    TextField,
    TiptapField,
  },
  fieldContext: fieldContext,
  formComponents: {
    FormSubmit,
  },
  formContext: formContext,
})

export { useAppForm, withFieldGroup, withForm }
