import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox'
import { css } from '@recipe-organizer/design-system/css'
import React, { useState, type ReactElement } from 'react'

import { CaretUpDownIcon } from '../../data-display/icons/caret-up-down'
import { XIcon } from '../../data-display/icons/x'
import { ScrollArea } from '../../layout/scroll-area/scroll-area'
import { type ComboboxImplProps, type ValueOptions } from './combobox'
import { type Option } from './options'

const inputGroupClassName = css({ '&:has(:disabled)': { opacity: 0.64 }, color: 'foreground', position: 'relative', width: 'full' })
const inputClassName = css({
  '&:disabled': { opacity: 1 },
  '&:has(+ [data-slot="combobox-trigger"], + [data-slot="combobox-clear"])': { paddingInlineEnd: '7' },
  backgroundColor: 'transparent',
  height: { base: '8.5', sm: '7.5' },
  lineHeight: { base: '2.125rem', sm: '1.875rem' },
  minWidth: '0',
  outline: 'none',
  paddingInline: 'calc(token(spacing.3) - 1px)',
  transition: 'background-color 5000000s ease-in-out 0s',
  width: 'full',
})
const actionClassName = css({
  '& svg': { flexShrink: 0, pointerEvents: 'none' },
  '&:has(+ [data-slot="combobox-clear"])': { display: 'none' },
  '--owner-icon-size': { base: '1.125rem', sm: '1rem' },
  '@media (pointer: coarse)': { _after: { content: '""', minHeight: '11', minWidth: '11', position: 'absolute' } },
  _hover: { opacity: 1 },
  alignItems: 'center',
  borderColor: 'transparent',
  borderRadius: 'md',
  borderWidth: '1px',
  cursor: 'pointer',
  display: 'inline-flex',
  height: { base: '8', sm: '7' },
  justifyContent: 'center',
  opacity: 0.8,
  outline: 'none',
  position: 'absolute',
  right: '.5',
  top: '50%',
  transform: 'translateY(-50%)',
  transitionDuration: '150ms',
  transitionProperty: 'opacity',
  transitionTimingFunction: 'in-out',
  width: { base: '8', sm: '7' },
})
const positionerClassName = css({ userSelect: 'none', zIndex: '50' })
const frameClassName = css({
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
  display: 'flex',
  maxHeight: 'full',
  maxWidth: 'var(--available-width)',
  minWidth: 'var(--anchor-width)',
  position: 'relative',
  transformOrigin: 'var(--transform-origin)',
  transitionDuration: '150ms',
  transitionProperty: 'scale, opacity',
  transitionTimingFunction: 'in-out',
})
const popupClassName = css({
  color: 'foreground',
  display: 'flex',
  flex: '1',
  flexDirection: 'column',
  maxHeight: 'min(var(--available-height), 23rem)',
})
const itemClassName = css({
  '& svg': { flexShrink: 0, pointerEvents: 'none' },
  '&[data-disabled]': { opacity: 0.64, pointerEvents: 'none' },
  '&[data-highlighted]': { backgroundColor: 'accent', color: 'accent-foreground' },
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
const separatorClassName = css({ '&:last-child': { display: 'none' }, backgroundColor: 'border', height: 'px', marginBlock: '1', marginInline: '2' })
const emptyClassName = css({
  '&:not(:empty)': { padding: '2' },
  color: 'muted-foreground',
  fontSize: { base: 'base', sm: 'sm' },
  textAlign: 'center',
})
const listClassName = css({ '&:not(:empty)': { padding: '1' }, '&[data-has-overflow-y]': { paddingInlineEnd: '3' }, scrollPaddingBlock: '1' })
const addClassName = css({ padding: '1' })
const Context = React.createContext<{ chipsRef: React.RefObject<Element | null> | null }>({ chipsRef: null })
const Root = <Value, Multiple extends boolean | undefined = false>(props: ComboboxPrimitive.Root.Props<Value, Multiple>): React.ReactElement => {
  const chipsRef = React.useRef<Element | null>(null)
  return (
    <Context.Provider value={{ chipsRef }}>
      <ComboboxPrimitive.Root {...props} />
    </Context.Provider>
  )
}
const Input = ({
  showClear = false,
  ...props
}: Omit<ComboboxPrimitive.Input.Props, 'size'> & { showClear?: boolean; ref?: React.Ref<HTMLInputElement> }): React.ReactElement => (
  <ComboboxPrimitive.InputGroup className={inputGroupClassName} data-slot="combobox-input-group">
    <ComboboxPrimitive.Input className={inputClassName} data-slot="combobox-input" render={<input />} {...props} />
    <ComboboxPrimitive.Trigger className={actionClassName} data-slot="combobox-trigger">
      <ComboboxPrimitive.Icon>
        <CaretUpDownIcon />
      </ComboboxPrimitive.Icon>
    </ComboboxPrimitive.Trigger>
    {showClear && (
      <ComboboxPrimitive.Clear className={actionClassName} data-slot="combobox-clear">
        <XIcon />
      </ComboboxPrimitive.Clear>
    )}
  </ComboboxPrimitive.InputGroup>
)
const Base = <TValue extends ValueOptions>({
  addNew,
  disabled,
  isInvalid,
  onChange,
  options,
  placeholder,
  selectedOption,
}: ComboboxImplProps<TValue>): ReactElement => {
  const [inputValue, setInputValue] = useState('')
  const { chipsRef: anchor } = React.useContext(Context)
  return (
    <Root<Option<TValue>>
      aria-invalid={isInvalid || undefined}
      disabled={disabled}
      items={options}
      onInputValueChange={setInputValue}
      onValueChange={onChange}
      value={selectedOption ?? null}
    >
      <Input placeholder={placeholder} showClear={Boolean(selectedOption)} />
      <ComboboxPrimitive.Portal>
        <ComboboxPrimitive.Positioner align="start" anchor={anchor} className={positionerClassName} side="bottom" sideOffset={4}>
          <span className={frameClassName}>
            <ComboboxPrimitive.Popup className={popupClassName} data-slot="combobox-popup">
              <ComboboxPrimitive.Empty className={emptyClassName}>Aucun résultat</ComboboxPrimitive.Empty>
              <ScrollArea scrollbarGutter scrollFade>
                <ComboboxPrimitive.List className={listClassName}>
                  {(item) => (
                    <ComboboxPrimitive.Item className={itemClassName} key={String(item.value)} value={item}>
                      <ComboboxPrimitive.ItemIndicator>
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
                      </ComboboxPrimitive.ItemIndicator>
                      <div>{item.label}</div>
                    </ComboboxPrimitive.Item>
                  )}
                </ComboboxPrimitive.List>
              </ScrollArea>
              {addNew && (
                <>
                  <ComboboxPrimitive.Separator className={separatorClassName} />
                  <div className={addClassName}>{addNew(inputValue)}</div>
                </>
              )}
            </ComboboxPrimitive.Popup>
          </span>
        </ComboboxPrimitive.Positioner>
      </ComboboxPrimitive.Portal>
    </Root>
  )
}
export default Base
