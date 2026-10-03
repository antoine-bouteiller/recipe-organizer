import { useState } from 'react'
import type { ReactElement, ReactNode } from 'react'

import { CheckIcon } from '@/components/ui/data-display/icons'
import { Separator } from '@/components/ui/layout/separator/separator'
import { Popover } from '@/components/ui/overlays/popover/popover'

import { Field, FieldError, FieldLabel, useFieldInvalid } from '../field/field'
import { Input } from '../input/input'
import { SelectButton } from '../select/select.shared'
import type { Option } from './options'

import * as styles from './combobox-field.css'

type ValueOptions = number | string | undefined

interface ComboboxFieldProps<TValue extends ValueOptions> {
  name: string
  value: TValue | undefined
  onChange: (value: TValue | undefined) => void
  addNew?: (inputValue: string) => ReactNode
  disabled?: boolean
  label?: string
  options: Option<TValue>[]
  placeholder?: string
  searchPlaceholder?: string
}

const ComboboxField = <TValue extends ValueOptions>({
  name,
  value,
  onChange,
  addNew,
  disabled,
  label,
  options,
  placeholder = 'Sélectionner une option',
  searchPlaceholder = 'Rechercher une option',
}: ComboboxFieldProps<TValue>): ReactElement => {
  const invalid = useFieldInvalid(name)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const selectedOption = options.find((opt) => opt.value === value)
  const filteredOptions = search ? options.filter((opt) => opt.label.toLowerCase().includes(search.toLowerCase())) : options

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) {
      setSearch('')
    }
  }

  const handleSelect = (option: Option<TValue>) => {
    onChange(option.value === value ? undefined : option.value)
    handleOpenChange(false)
  }

  return (
    <Field name={name}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <Popover
        onOpenChange={handleOpenChange}
        open={open}
        renderTrigger={(props) => (
          <SelectButton {...props} aria-invalid={invalid || undefined} disabled={disabled}>
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
