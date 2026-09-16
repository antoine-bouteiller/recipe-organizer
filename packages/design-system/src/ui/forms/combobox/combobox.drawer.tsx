import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer'
import { css } from '@recipe-organizer/design-system/css'
import { useMemo, useState, type ReactElement } from 'react'

import { CheckIcon } from '../../data-display/icons/check'
import { Separator } from '../../layout/separator/separator'
import { Drawer, DrawerHeader, DrawerPanel, DrawerPopup, DrawerTitle } from '../../overlays/drawer/drawer'
import { Input } from '../input/input'
import { SelectButton } from '../select/select.shared'
import { type ComboboxImplProps, type ValueOptions } from './combobox'

const columnClassName = css({ display: 'flex', flexDirection: 'column', gap: '2' })
const optionsClassName = css({ display: 'flex', flexDirection: 'column', maxHeight: '64', overflowY: 'auto' })
const emptyClassName = css({ color: 'muted-foreground', fontSize: 'sm', paddingBlock: '4', textAlign: 'center' })
const itemClassName = css({
  _active: { backgroundColor: 'accent', color: 'accent-foreground' },
  alignItems: 'center',
  borderRadius: 'sm',
  cursor: 'default',
  display: 'flex',
  fontSize: 'base',
  gap: '2',
  justifyContent: 'space-between',
  minHeight: '10',
  outline: 'none',
  paddingBlock: '1.5',
  paddingInline: '2',
  width: 'full',
})
const truncateClassName = css({ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' })
const iconClassName = css({ flexShrink: '0' })
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
          <div className={columnClassName}>
            <Input onChange={(event) => setSearch(event.target.value)} placeholder={searchPlaceholder} value={search} />
            <div className={optionsClassName}>
              {filteredOptions.length === 0 && <p className={emptyClassName}>Aucun résultat</p>}
              {filteredOptions.map((option) => (
                <button
                  className={itemClassName}
                  key={String(option.value)}
                  onClick={() => {
                    onChange(option)
                    setOpen(false)
                    setSearch('')
                  }}
                  type="button"
                >
                  <span className={truncateClassName}>{option.label}</span>
                  {selectedOption?.value === option.value && (
                    <span className={iconClassName}>
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
