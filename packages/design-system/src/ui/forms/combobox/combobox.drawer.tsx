import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer'
import { useMemo, useState, type ReactElement } from 'react'

import { CheckIcon } from '../../data-display/icons/check'
import { Separator } from '../../layout/separator/separator'
import { Drawer, DrawerHeader, DrawerPanel, DrawerPopup, DrawerTitle } from '../../overlays/drawer/drawer'
import { Input } from '../input/input'
import { SelectButton } from '../select/select.shared'
import { type ComboboxImplProps, type ValueOptions } from './combobox'

import * as styles from './combobox.drawer.css'

const ComboboxDrawer = <TValue extends ValueOptions>({
  addNew,
  disabled,
  isInvalid,
  onChange,
  options,
  placeholder,
  searchPlaceholder,
  selectedOption,
  title,
}: ComboboxImplProps<TValue>): ReactElement => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const filteredOptions = useMemo(
    () => (search ? options.filter((opt) => opt.label.toLowerCase().includes(search.toLowerCase())) : options),
    [options, search]
  )
  return (
    <Drawer onOpenChange={setOpen} open={open}>
      <DrawerPrimitive.Trigger
        data-slot="drawer-trigger"
        disabled={disabled}
        render={<SelectButton aria-invalid={isInvalid || undefined}>{selectedOption?.label ?? placeholder}</SelectButton>}
      />
      <DrawerPopup>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        <DrawerPanel>
          <div className={styles.column}>
            <Input onChange={(event) => setSearch(event.target.value)} placeholder={searchPlaceholder} value={search} />
            <div className={styles.options}>
              {filteredOptions.length === 0 && <p className={styles.empty}>Aucun résultat</p>}
              {filteredOptions.map((option) => (
                <button
                  className={styles.item}
                  key={String(option.value)}
                  onClick={() => {
                    onChange(option)
                    setOpen(false)
                    setSearch('')
                  }}
                  type="button"
                >
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
        </DrawerPanel>
      </DrawerPopup>
    </Drawer>
  )
}
export default ComboboxDrawer
