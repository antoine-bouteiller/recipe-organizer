import { Select as SelectPrimitive } from '@base-ui/react/select'
import { CaretDownIcon } from '@recipe-organizer/design-system/icons/caret-down'
import { CaretUpIcon } from '@recipe-organizer/design-system/icons/caret-up'
import { CaretUpDownIcon } from '@recipe-organizer/design-system/icons/caret-up-down'
import { CheckIcon } from '@recipe-organizer/design-system/icons/check'
import { type ReactElement } from 'react'

import { type SelectProps } from './select'
import { getSelectDisplay, selectText } from './select.shared'

import * as styles from './select.base.css'
import * as shared from './select.shared.css'

const SelectBase = <TValue extends string>(props: SelectProps<TValue>): ReactElement => {
  const { items, disabled } = props
  const { displayLabel, isEmpty } = getSelectDisplay(props)
  const trigger = (
    <SelectPrimitive.Trigger className={shared.selectTrigger} data-slot="select-trigger" disabled={disabled}>
      <span className={selectText(isEmpty)}>{displayLabel}</span>
      <SelectPrimitive.Icon className={shared.selectTriggerIcon} data-slot="select-icon">
        <CaretUpDownIcon />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
  const popup = (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        align="start"
        alignItemWithTrigger
        className={styles.positioner}
        data-slot="select-positioner"
        side="bottom"
        sideOffset={4}
      >
        <SelectPrimitive.Popup className={styles.popup} data-slot="select-popup">
          <SelectPrimitive.ScrollUpArrow className={styles.scrollUpArrow} data-slot="select-scroll-up-arrow">
            <span className={styles.icon}>
              <CaretUpIcon />
            </span>
          </SelectPrimitive.ScrollUpArrow>
          <div className={styles.popupFrame}>
            <SelectPrimitive.List className={styles.list} data-slot="select-list">
              {items.map((item) => (
                <SelectPrimitive.Item className={styles.item} data-slot="select-item" key={item.value ?? 'none'} value={item.value}>
                  <SelectPrimitive.ItemIndicator className={styles.indicator}>
                    <CheckIcon size="sm" />
                  </SelectPrimitive.ItemIndicator>
                  <SelectPrimitive.ItemText className={styles.itemText}>{item.label}</SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.List>
          </div>
          <SelectPrimitive.ScrollDownArrow className={styles.scrollDownArrow} data-slot="select-scroll-down-arrow">
            <span className={styles.icon}>
              <CaretDownIcon />
            </span>
          </SelectPrimitive.ScrollDownArrow>
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
  return props.multiple ? (
    <SelectPrimitive.Root disabled={disabled} items={items} multiple onValueChange={props.onValueChange} value={props.value}>
      {trigger}
      {popup}
    </SelectPrimitive.Root>
  ) : (
    <SelectPrimitive.Root disabled={disabled} items={items} onValueChange={props.onValueChange} value={props.value ?? null}>
      {trigger}
      {popup}
    </SelectPrimitive.Root>
  )
}
export default SelectBase
