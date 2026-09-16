import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer'
import { css } from '@recipe-organizer/design-system/css'
import { useState, type ReactElement } from 'react'

import { CheckIcon } from '../../data-display/icons/check'
import { Drawer, DrawerHeader, DrawerPanel, DrawerPopup, DrawerTitle } from '../../overlays/drawer/drawer'
import { type SelectProps } from './select'
import { getSelectDisplay, SelectButton, selectTextClassName } from './select.shared'

const listClassName = css({ display: 'flex', flexDirection: 'column' })
const itemClassName = css({
  _hover: { backgroundColor: 'accent', color: 'accent-foreground' },
  alignItems: 'center',
  borderRadius: 'sm',
  display: 'flex',
  fontSize: 'base',
  gap: '2',
  justifyContent: 'space-between',
  minHeight: '11',
  outline: 'none',
  paddingInline: '2',
  width: 'full',
})
const labelClassName = css({ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' })
const iconClassName = css({ flexShrink: '0' })
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
            <span className={selectTextClassName(isEmpty)}>{displayLabel}</span>
          </SelectButton>
        }
      />
      <DrawerPopup>
        <DrawerHeader>
          <DrawerTitle>{title ?? placeholder}</DrawerTitle>
        </DrawerHeader>
        <DrawerPanel>
          <div className={listClassName}>
            {items.map((item) => (
              <button className={itemClassName} key={item.value ?? 'none'} onClick={() => handleSelect(item.value)} type="button">
                <span className={labelClassName}>{item.label}</span>
                {isSelected(item.value) && (
                  <span className={iconClassName}>
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
