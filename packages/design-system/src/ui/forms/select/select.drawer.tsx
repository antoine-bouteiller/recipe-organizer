import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer'
import { Drawer, DrawerHeader, DrawerPanel, DrawerPopup, DrawerTitle } from '@design-system/ui/overlays/drawer/drawer'
import { CheckIcon } from '@recipe-organizer/design-system/icons/check'
import { useState } from 'react'
import type { ReactElement } from 'react'

import type { SelectProps } from './select'
import { SelectButton } from './select.shared'

import * as styles from './select.drawer.css'
import * as shared from './select.shared.css'

const SelectDrawer = ({
  'aria-invalid': ariaInvalid,
  disabled,
  items,
  onValueChange,
  placeholder = 'Sélectionner',
  title,
  value,
}: SelectProps<string>): ReactElement => {
  const [open, setOpen] = useState(false)
  const selected = items.find((item) => item.value === (value ?? null))
  return (
    <Drawer onOpenChange={setOpen} open={open}>
      <DrawerPrimitive.Trigger
        data-slot="drawer-trigger"
        disabled={disabled}
        render={
          <SelectButton aria-invalid={ariaInvalid || undefined}>
            <span className={shared.selectTextState[selected ? 'selected' : 'empty']}>{selected?.label ?? placeholder}</span>
          </SelectButton>
        }
      />
      <DrawerPopup>
        <DrawerHeader>
          <DrawerTitle>{title ?? placeholder}</DrawerTitle>
        </DrawerHeader>
        <DrawerPanel>
          <div className={styles.list}>
            {items.map((item) => (
              <button
                className={styles.item}
                key={item.value ?? 'none'}
                onClick={() => {
                  onValueChange(item.value)
                  setOpen(false)
                }}
                type="button"
              >
                <span className={styles.label}>{item.label}</span>
                {item === selected && (
                  <span className={styles.icon}>
                    <CheckIcon size="sm" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </DrawerPanel>
      </DrawerPopup>
    </Drawer>
  )
}
export default SelectDrawer
