import { createFormHook } from '@tanstack/react-form'
import { lazy } from 'react'

import { CheckboxField } from '../ui/forms/checkbox-field/checkbox-field'
import { ComboboxField } from '../ui/forms/combobox-field/combobox-field'
import { Field, FieldControl, FieldDescription, FieldError, FieldLabel } from '../ui/forms/field/field'
import { FormSubmit } from '../ui/forms/form-submit/form-submit'
import { ImageField } from '../ui/forms/image-field/image-field'
import { NumberField } from '../ui/forms/number-field/number-field'
import { SelectField } from '../ui/forms/select-field/select-field'
import { TextField } from '../ui/forms/text-field/text-field'
import { ToggleGroupField } from '../ui/forms/toggle-group-field/toggle-group-field'
import { VideoField } from '../ui/forms/video-field/video-field'
import { fieldContext, formContext } from './use-form-context'

const EditorField = lazy(() => import('../ui/forms/editor-field/editor-field'))

const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    CheckboxField,
    ComboboxField,
    EditorField,
    Field,
    FieldControl,
    FieldDescription,
    FieldError,
    FieldLabel,
    ImageField,
    NumberField,
    SelectField,
    TextField,
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
