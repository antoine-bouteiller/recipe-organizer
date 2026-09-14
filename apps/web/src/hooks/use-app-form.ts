import { CheckboxField } from '@client/components/forms/checkbox-field'
import { ComboboxField } from '@client/components/forms/combobox-field'
import { FormSubmit } from '@client/components/forms/form-submit'
import { ImageField } from '@client/components/forms/image-field'
import { NumberField } from '@client/components/forms/number-field'
import { SelectField } from '@client/components/forms/select-field'
import { TextField } from '@client/components/forms/text-field'
import { ToggleGroupField } from '@client/components/forms/toggle-group-field'
import { VideoField } from '@client/components/forms/video-field'
import { Field, FieldControl, FieldDescription, FieldError, FieldLabel } from '@client/components/ui/field'
import { fieldContext, formContext } from '@client/hooks/use-form-context'
import { createFormHook } from '@tanstack/react-form'
import { lazy } from 'react'
import * as z from 'zod'

z.config(z.locales.fr())

const EditorField = lazy(() => import('@client/components/forms/editor-field'))

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
