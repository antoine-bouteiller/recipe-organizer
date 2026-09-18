import { Autocomplete as AutocompletePrimitive } from '@base-ui/react/autocomplete'
import { Dialog as CommandDialogPrimitive } from '@base-ui/react/dialog'
import { ScrollArea } from '@design-system/ui/layout/scroll-area/scroll-area'
import { Button } from '@recipe-organizer/design-system/button'
import { MagnifyingGlassIcon } from '@recipe-organizer/design-system/icons/magnifying-glass'
import type React from 'react'

import * as styles from './command.css'

type InputProps = Pick<AutocompletePrimitive.Input.Props, 'placeholder'>
type ItemProps = Pick<AutocompletePrimitive.Item.Props, 'children' | 'onClick' | 'value'>
type ListProps = Pick<AutocompletePrimitive.List.Props, 'children'>
type EmptyProps = Pick<AutocompletePrimitive.Empty.Props, 'children'>
type DialogRootProps = Pick<CommandDialogPrimitive.Root.Props, 'children' | 'onOpenChange' | 'open'>
type DialogTriggerProps = Pick<CommandDialogPrimitive.Trigger.Props, 'children' | 'render'>
type DialogPopupProps = Pick<CommandDialogPrimitive.Popup.Props, 'aria-label' | 'children'>
type CommandProps<ItemValue> = Pick<AutocompletePrimitive.Root.Props<ItemValue>, 'children'> & { items?: readonly ItemValue[] }
type PlainProps = Pick<React.ComponentProps<'div'>, 'children'>

const defaultCommandDialogTriggerRender = <Button variant="outline" />

const AutocompleteInput = ({ placeholder }: InputProps): React.ReactElement => (
  <AutocompletePrimitive.InputGroup className={styles.inputGroup()} data-slot="autocomplete-input-group">
    <div aria-hidden className={styles.addon()} data-slot="autocomplete-start-addon">
      <MagnifyingGlassIcon />
    </div>
    <AutocompletePrimitive.Input autoFocus className={styles.input()} data-slot="autocomplete-input" placeholder={placeholder} />
  </AutocompletePrimitive.InputGroup>
)

export const CommandDialog = ({ children, onOpenChange, open }: DialogRootProps): React.ReactElement => (
  <CommandDialogPrimitive.Root onOpenChange={onOpenChange} open={open}>
    {children}
  </CommandDialogPrimitive.Root>
)
export const CommandDialogTrigger = ({ children, render = defaultCommandDialogTriggerRender }: DialogTriggerProps): React.ReactElement => (
  <CommandDialogPrimitive.Trigger data-slot="command-dialog-trigger" render={render}>
    {children}
  </CommandDialogPrimitive.Trigger>
)
export const CommandDialogPopup = ({ children, 'aria-label': ariaLabel }: DialogPopupProps): React.ReactElement => (
  <CommandDialogPrimitive.Portal>
    <CommandDialogPrimitive.Backdrop className={styles.backdrop()} data-slot="command-dialog-backdrop" />
    <CommandDialogPrimitive.Viewport className={styles.viewport()} data-slot="command-dialog-viewport">
      <CommandDialogPrimitive.Popup aria-label={ariaLabel} className={styles.popup()} data-slot="command-dialog-popup">
        {children}
      </CommandDialogPrimitive.Popup>
    </CommandDialogPrimitive.Viewport>
  </CommandDialogPrimitive.Portal>
)
export const Command = <ItemValue,>({ children, items }: CommandProps<ItemValue>): React.ReactElement => (
  <AutocompletePrimitive.Root<ItemValue> autoHighlight="always" inline items={items} keepHighlight open>
    {children}
  </AutocompletePrimitive.Root>
)
export const CommandInput = (props: InputProps): React.ReactElement => (
  <div className={styles.container()}>
    <AutocompleteInput {...props} />
  </div>
)
export const CommandList = ({ children }: ListProps): React.ReactElement => (
  <ScrollArea scrollbarGutter="compact" scrollFade>
    <AutocompletePrimitive.List className={styles.list()} data-slot="command-list">
      {children}
    </AutocompletePrimitive.List>
  </ScrollArea>
)
export const CommandEmpty = ({ children }: EmptyProps): React.ReactElement => (
  <AutocompletePrimitive.Empty className={styles.empty()} data-slot="command-empty">
    {children}
  </AutocompletePrimitive.Empty>
)
export const CommandPanel = ({ children }: PlainProps): React.ReactElement => (
  <div className={styles.panel()} data-slot="command-panel">
    {children}
  </div>
)
export const CommandItem = ({ children, onClick, value }: ItemProps): React.ReactElement => (
  <AutocompletePrimitive.Item className={styles.item()} data-slot="command-item" onClick={onClick} value={value}>
    {children}
  </AutocompletePrimitive.Item>
)
export const CommandFooter = ({ children }: PlainProps): React.ReactElement => (
  <div className={styles.footer()} data-slot="command-footer">
    {children}
  </div>
)
