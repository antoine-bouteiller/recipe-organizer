import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox'
import React, { useState, type ReactElement } from 'react'

import { CaretUpDownIcon } from '../../data-display/icons/caret-up-down'
import { XIcon } from '../../data-display/icons/x'
import { ScrollArea } from '../../layout/scroll-area/scroll-area'
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
