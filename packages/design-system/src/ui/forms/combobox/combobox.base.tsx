import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox'
import { ScrollArea } from '@design-system/ui/layout/scroll-area/scroll-area'
import { CaretUpDownIcon } from '@recipe-organizer/design-system/icons/caret-up-down'
import { CheckIcon } from '@recipe-organizer/design-system/icons/check'
import { XIcon } from '@recipe-organizer/design-system/icons/x'
import React, { useState, type ReactElement } from 'react'

import { type ComboboxImplProps, type ValueOptions } from './combobox'
import { type Option } from './options'

import * as styles from './combobox.base.css'

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
  <ComboboxPrimitive.InputGroup className={styles.inputGroup} data-slot="combobox-input-group">
    <ComboboxPrimitive.Input className={styles.input} data-slot="combobox-input" render={<input />} {...props} />
    <ComboboxPrimitive.Trigger className={styles.action} data-slot="combobox-trigger">
      <ComboboxPrimitive.Icon>
        <CaretUpDownIcon />
      </ComboboxPrimitive.Icon>
    </ComboboxPrimitive.Trigger>
    {showClear && (
      <ComboboxPrimitive.Clear className={styles.action} data-slot="combobox-clear">
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
        <ComboboxPrimitive.Positioner align="start" anchor={anchor} className={styles.positioner} side="bottom" sideOffset={4}>
          <span className={styles.frame}>
            <ComboboxPrimitive.Popup className={styles.popup} data-slot="combobox-popup">
              <ComboboxPrimitive.Empty className={styles.empty}>Aucun résultat</ComboboxPrimitive.Empty>
              <ScrollArea scrollbarGutter scrollFade>
                <ComboboxPrimitive.List className={styles.list}>
                  {(item) => (
                    <ComboboxPrimitive.Item className={styles.item} key={String(item.value)} value={item}>
                      <ComboboxPrimitive.ItemIndicator>
                        <CheckIcon size="sm" />
                      </ComboboxPrimitive.ItemIndicator>
                      <div>{item.label}</div>
                    </ComboboxPrimitive.Item>
                  )}
                </ComboboxPrimitive.List>
              </ScrollArea>
              {addNew && (
                <>
                  <ComboboxPrimitive.Separator className={styles.separator} />
                  <div className={styles.add}>{addNew(inputValue)}</div>
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
