import { createFormHook } from '@tanstack/react-form'

import { ComboboxField } from '../components/ui/forms/combobox-field/combobox-field'
import { Field, FieldError } from '../components/ui/forms/field/field'
import { FormSubmit } from '../components/ui/forms/form-submit/form-submit'
import { ImageField } from '../components/ui/forms/image-field/image-field'
import { NumberField } from '../components/ui/forms/number-field/number-field'
import { SelectField } from '../components/ui/forms/select-field/select-field'
import { TextField } from '../components/ui/forms/text-field/text-field'
import { TextareaField } from '../components/ui/forms/textarea-field/textarea-field'
import { ToggleGroupField } from '../components/ui/forms/toggle-group-field/toggle-group-field'
import { VideoField } from '../components/ui/forms/video-field/video-field'
import { fieldContext, formContext } from './use-form-context'

const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    ComboboxField,
    Field,
    FieldError,
    ImageField,
    NumberField,
    SelectField,
    TextField,
    TextareaField,
    ToggleGroupField,
    VideoField,
  },
  fieldContext,
  formComponents: {
    FormSubmit,
  },
  formContext,
})

export { useAppForm, withForm }
