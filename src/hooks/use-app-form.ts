import {
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormItem,
  FormSubmit,
} from '@/components/forms/form'
import { ImageField } from '@/components/forms/image-field'
import { NumberField } from '@/components/forms/number-field'
import { ComboboxField } from '@/components/forms/combobox-field'
import { TextField } from '@/components/forms/text-field'
import TiptapField from '@/components/forms/tiptap-field'
import { fieldContext, formContext } from '@/hooks/use-form-context'
import { createFormHook } from '@tanstack/react-form'

const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldContext: fieldContext,
  formContext: formContext,
  fieldComponents: {
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
    FormItem,
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

export { useAppForm, withForm, withFieldGroup }
