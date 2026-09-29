import { useFieldContext } from '@design-system/hooks/use-form-context'
import { CheckIcon } from '@recipe-organizer/design-system/icons'
import { Popover } from '@recipe-organizer/design-system/popover'
import { Separator } from '@recipe-organizer/design-system/separator'
import { useState } from 'react'
import type { ReactElement, ReactNode } from 'react'

import { Field, FieldError, FieldLabel } from '../field/field'
import { Input } from '../input/input'
import { SelectButton } from '../select/select.shared'
import type { Option } from './options'

import * as styles from './combobox-field.css'

type ValueOptions = number | string | undefined

interface ComboboxFieldProps<TValue extends ValueOptions> {
  addNew?: (inputValue: string) => ReactNode
  disabled?: boolean
  label?: string
  options: Option<TValue>[]
  placeholder?: string
  searchPlaceholder?: string
}

const ComboboxField = <TValue extends ValueOptions>({
  addNew,
  disabled,
  label,
  options,
  placeholder = 'Sélectionner une option',
  searchPlaceholder = 'Rechercher une option',
}: ComboboxFieldProps<TValue>): ReactElement => {
  const field = useFieldContext<TValue | undefined>()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const { value } = field.store.state
  const selectedOption = options.find((opt) => opt.value === value)
  const filteredOptions = search ? options.filter((opt) => opt.label.toLowerCase().includes(search.toLowerCase())) : options

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) {
      setSearch('')
    }
  }

  const handleSelect = (option: Option<TValue>) => {
    field.setValue(option.value === value ? undefined : option.value)
    handleOpenChange(false)
  }

  return (
    <Field invalid={!field.state.meta.isValid} name={field.name}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <Popover
        onOpenChange={handleOpenChange}
        open={open}
        renderTrigger={(props) => (
          <SelectButton {...props} aria-invalid={(field.state.meta.isTouched && !field.state.meta.isValid) || undefined} disabled={disabled}>
            {selectedOption?.label ?? placeholder}
          </SelectButton>
        )}
      >
        <div className={styles.column}>
          <Input onChange={(event) => setSearch(event.target.value)} placeholder={searchPlaceholder} value={search} />
          <div className={styles.options}>
            {filteredOptions.length === 0 && <p className={styles.empty}>Aucun résultat</p>}
            {filteredOptions.map((option) => (
              <button className={styles.item} key={String(option.value)} onClick={() => handleSelect(option)} type="button">
                <span className={styles.truncate}>{option.label}</span>
                {selectedOption?.value === option.value && (
                  <span className={styles.icon}>
                    <CheckIcon size="sm" />
                  </span>
                )}
              </button>
            ))}
          </div>
          {addNew && (
            <>
              <Separator />
              {addNew(search)}
            </>
          )}
        </div>
      </Popover>
      <FieldError />
    </Field>
  )
}

export { ComboboxField }
