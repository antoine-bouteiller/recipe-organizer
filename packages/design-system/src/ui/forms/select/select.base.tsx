import { Select as SelectPrimitive } from '@base-ui/react/select'
import { css } from '@recipe-organizer/design-system/css'
import { type ReactElement } from 'react'

import { CaretDownIcon } from '../../data-display/icons/caret-down'
import { CaretUpIcon } from '../../data-display/icons/caret-up'
import { CaretUpDownIcon } from '../../data-display/icons/caret-up-down'
import { type SelectProps } from './select'
import { getSelectDisplay, selectTextClassName, selectTriggerClassName, selectTriggerIconClassName } from './select.shared'

const positionerClassName = css({ userSelect: 'none', zIndex: '50' })
const popupClassName = css({ color: 'foreground', outline: 'none', transformOrigin: 'var(--transform-origin)' })
const popupFrameClassName = css({
  '&::before': {
    borderRadius: 'calc(token(radii.lg) - 1px)',
    boxShadow: {
      _dark: '0 -1px color-mix(in oklab, token(colors.white) 6%, transparent)',
      base: '0 1px color-mix(in oklab, token(colors.black) 4%, transparent)',
    },
    content: '""',
    inset: '0',
    pointerEvents: 'none',
    position: 'absolute',
  },
  backgroundClip: 'padding-box',
  backgroundColor: 'popover',
  borderRadius: 'lg',
  borderWidth: '1px',
  boxShadow: 'overlay',
  height: 'full',
  minWidth: 'var(--anchor-width)',
  position: 'relative',
})
const listClassName = css({ maxHeight: 'var(--available-height)', overflowY: 'auto', padding: '1' })
const arrowClassName = css({
  alignItems: 'center',
  cursor: 'default',
  display: 'flex',
  height: '6',
  justifyContent: 'center',
  position: 'relative',
  width: 'full',
  zIndex: '50',
})
const scrollUpArrowClassName = css({
  '&::before': {
    backgroundImage: 'linear-gradient(to bottom, token(colors.popover) 50%, transparent)',
    borderStartEndRadius: 'calc(token(radii.lg) - 1px)',
    borderStartStartRadius: 'calc(token(radii.lg) - 1px)',
    content: '""',
    height: '200%',
    insetInline: '1px',
    pointerEvents: 'none',
    position: 'absolute',
    top: '1px',
  },
})
const scrollDownArrowClassName = css({
  '&::before': {
    backgroundImage: 'linear-gradient(to top, token(colors.popover) 50%, transparent)',
    borderEndEndRadius: 'calc(token(radii.lg) - 1px)',
    borderEndStartRadius: 'calc(token(radii.lg) - 1px)',
    bottom: '1px',
    content: '""',
    height: '200%',
    insetInline: '1px',
    pointerEvents: 'none',
    position: 'absolute',
  },
})
const itemClassName = css({
  '& svg': { flexShrink: 0, pointerEvents: 'none' },
  '&[data-disabled]': { opacity: 0.64, pointerEvents: 'none' },
  '&[data-highlighted]': { backgroundColor: 'accent', color: 'accent-foreground' },
  '&[data-side="none"]': { minWidth: 'calc(var(--anchor-width) + 1.25rem)' },
  '--owner-icon-size': { base: '1.125rem', sm: '1rem' },
  alignItems: 'center',
  borderRadius: 'sm',
  cursor: 'default',
  display: 'grid',
  fontSize: { base: 'base', sm: 'sm' },
  gap: '2',
  gridTemplateColumns: '1rem 1fr',
  minHeight: { base: '8', sm: '7' },
  outline: 'none',
  paddingBlock: '1',
  paddingInlineEnd: '4',
  paddingInlineStart: '2',
})
const iconClassName = css({ height: { base: '4.5', sm: '4' }, position: 'relative', width: { base: '4.5', sm: '4' } })
const indicatorClassName = css({ gridColumnStart: '1' })
const itemTextClassName = css({ gridColumnStart: '2', minWidth: 0 })
const SelectTrigger = (props: SelectPrimitive.Trigger.Props): ReactElement => (
  <SelectPrimitive.Trigger className={selectTriggerClassName} data-slot="select-trigger" {...props}>
    <>
      {props.children}
      <SelectPrimitive.Icon className={selectTriggerIconClassName} data-slot="select-icon">
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
      className={positionerClassName}
      data-slot="select-positioner"
      side="bottom"
      sideOffset={4}
    >
      <SelectPrimitive.Popup className={popupClassName} data-slot="select-popup" {...props}>
        <SelectPrimitive.ScrollUpArrow className={`${arrowClassName} ${scrollUpArrowClassName}`} data-slot="select-scroll-up-arrow">
          <span className={iconClassName}>
            <CaretUpIcon />
          </span>
        </SelectPrimitive.ScrollUpArrow>
        <div className={popupFrameClassName}>
          <SelectPrimitive.List className={listClassName} data-slot="select-list">
            {children}
          </SelectPrimitive.List>
        </div>
        <SelectPrimitive.ScrollDownArrow className={`${arrowClassName} ${scrollDownArrowClassName}`} data-slot="select-scroll-down-arrow">
          <span className={iconClassName}>
            <CaretDownIcon />
          </span>
        </SelectPrimitive.ScrollDownArrow>
      </SelectPrimitive.Popup>
    </SelectPrimitive.Positioner>
  </SelectPrimitive.Portal>
)
const SelectItem = (props: SelectPrimitive.Item.Props): ReactElement => (
  <SelectPrimitive.Item className={itemClassName} data-slot="select-item" {...props}>
    <SelectPrimitive.ItemIndicator className={indicatorClassName}>
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
    <SelectPrimitive.ItemText className={itemTextClassName}>{props.children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
)
const SelectBase = <TValue extends string>(props: SelectProps<TValue>): ReactElement => {
  const { items, disabled } = props
  const { displayLabel, isEmpty } = getSelectDisplay(props)
  const trigger = (
    <SelectTrigger disabled={disabled}>
      <span className={selectTextClassName(isEmpty)}>{displayLabel}</span>
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
