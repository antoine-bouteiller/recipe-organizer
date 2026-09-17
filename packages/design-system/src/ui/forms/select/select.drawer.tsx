import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer'
import { useState, type ReactElement } from 'react'

import { CheckIcon } from '../../data-display/icons/check'
import { Drawer, DrawerHeader, DrawerPanel, DrawerPopup, DrawerTitle } from '../../overlays/drawer/drawer'
import { type SelectProps } from './select'
import { getSelectDisplay, SelectButton, selectText } from './select.shared'

import * as styles from './select.drawer.css'

const SelectDrawer = <TValue extends string>(props: SelectProps<TValue>): ReactElement => {
  const { items, placeholder = 'Sélectionner', title, disabled } = props
  const [open, setOpen] = useState(false)
  const { displayLabel, isEmpty, isSelected } = getSelectDisplay(props)
  const handleSelect = (value: TValue | null) => {
    if (props.multiple) {
      if (value !== null) {
        props.onValueChange(props.value.includes(value) ? props.value.filter((item) => item !== value) : [...props.value, value])
      }
    } else {
      props.onValueChange(value)
      setOpen(false)
    }
  }
  return (
    <Drawer onOpenChange={setOpen} open={open}>
      <DrawerPrimitive.Trigger
        data-slot="drawer-trigger"
        disabled={disabled}
        render={
          <SelectButton>
            <span className={selectText(isEmpty)}>{displayLabel}</span>
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
              <button className={styles.item} key={item.value ?? 'none'} onClick={() => handleSelect(item.value)} type="button">
                <span className={styles.label}>{item.label}</span>
                {isSelected(item.value) && (
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
