import { ComboboxField } from '@/components/forms/combobox-field'
import { ImageField } from '@/components/forms/image-field'
import { NumberField } from '@/components/forms/number-field'
import { TextField } from '@/components/forms/text-field'
import TiptapField from '@/components/forms/tiptap-field'
import {
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
  FormSubmit,
} from '@/components/ui/field'
import { fieldContext, formContext } from '@/hooks/use-form-context'
import { createFormHook } from '@tanstack/react-form'

const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldContext: fieldContext,
  formContext: formContext,
  fieldComponents: {
    FieldLabel,
    FieldControl,
    FieldDescription,
    FieldError,
    Field,
    TextField,
    NumberField,
    ImageField,
    TiptapField,
    ComboboxField,
  },
  formComponents: {
    FormSubmit,
  },
})

export { useAppForm, withFieldGroup, withForm }
