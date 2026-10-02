import { createFormHook } from '@tanstack/react-form'

import { ComboboxField } from '../ui/forms/combobox-field/combobox-field'
import { Field, FieldError } from '../ui/forms/field/field'
import { FormSubmit } from '../ui/forms/form-submit/form-submit'
import { ImageField } from '../ui/forms/image-field/image-field'
import { NumberField } from '../ui/forms/number-field/number-field'
import { SelectField } from '../ui/forms/select-field/select-field'
import { TextField } from '../ui/forms/text-field/text-field'
import { TextareaField } from '../ui/forms/textarea-field/textarea-field'
import { ToggleGroupField } from '../ui/forms/toggle-group-field/toggle-group-field'
import { VideoField } from '../ui/forms/video-field/video-field'
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
