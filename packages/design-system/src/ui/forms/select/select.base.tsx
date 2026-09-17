import { Select as SelectPrimitive } from '@base-ui/react/select'
import { type ReactElement } from 'react'

import { CaretDownIcon } from '../../data-display/icons/caret-down'
import { CaretUpIcon } from '../../data-display/icons/caret-up'
import { CaretUpDownIcon } from '../../data-display/icons/caret-up-down'
import { type SelectProps } from './select'
import { getSelectDisplay, selectText } from './select.shared'

import * as styles from './select.base.css'
import * as shared from './select.shared.css'

const SelectTrigger = (props: SelectPrimitive.Trigger.Props): ReactElement => (
  <SelectPrimitive.Trigger className={shared.selectTrigger} data-slot="select-trigger" {...props}>
    <>
      {props.children}
      <SelectPrimitive.Icon className={shared.selectTriggerIcon} data-slot="select-icon">
        <CaretUpDownIcon />
      </SelectPrimitive.Icon>
    </>
  </SelectPrimitive.Trigger>
)
const SelectPopup = ({ children, ...props }: SelectPrimitive.Popup.Props): ReactElement => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Positioner
      align="start"
      alignItemWithTrigger
      className={styles.positioner}
      data-slot="select-positioner"
      side="bottom"
      sideOffset={4}
    >
      <SelectPrimitive.Popup className={styles.popup} data-slot="select-popup" {...props}>
        <SelectPrimitive.ScrollUpArrow className={styles.scrollUpArrow} data-slot="select-scroll-up-arrow">
          <span className={styles.icon}>
            <CaretUpIcon />
          </span>
        </SelectPrimitive.ScrollUpArrow>
        <div className={styles.popupFrame}>
          <SelectPrimitive.List className={styles.list} data-slot="select-list">
            {children}
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
const SelectItem = (props: SelectPrimitive.Item.Props): ReactElement => (
  <SelectPrimitive.Item className={styles.item} data-slot="select-item" {...props}>
    <SelectPrimitive.ItemIndicator className={styles.indicator}>
      <svg
        aria-hidden="true"
        fill="none"
        height="24"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24"
      >
        <path d="M5.252 12.7 10.2 18.63 18.748 5.37" />
      </svg>
    </SelectPrimitive.ItemIndicator>
    <SelectPrimitive.ItemText className={styles.itemText}>{props.children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
)
const SelectBase = <TValue extends string>(props: SelectProps<TValue>): ReactElement => {
  const { items, disabled } = props
  const { displayLabel, isEmpty } = getSelectDisplay(props)
  const trigger = (
    <SelectTrigger disabled={disabled}>
      <span className={selectText(isEmpty)}>{displayLabel}</span>
    </SelectTrigger>
  )
  const popup = (
    <SelectPopup>
      {items.map((item) => (
        <SelectItem key={item.value ?? 'none'} value={item.value}>
          {item.label}
        </SelectItem>
      ))}
    </SelectPopup>
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
