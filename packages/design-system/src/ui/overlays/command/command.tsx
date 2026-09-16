import { Autocomplete as AutocompletePrimitive } from '@base-ui/react/autocomplete'
import { Dialog as CommandDialogPrimitive } from '@base-ui/react/dialog'
import { cva } from '@recipe-organizer/design-system/css'
import type React from 'react'

import { Button } from '../../actions/button/button'
import { MagnifyingGlassIcon } from '../../data-display/icons/magnifying-glass'
import { ScrollArea } from '../../layout/scroll-area/scroll-area'

const inputGroupClassName = cva({
  base: {
    '&:has(:disabled)': { opacity: '0.64' },
    '&:not(:has(> [data-width=full]))': { width: 'fit-content' },
    color: 'foreground',
    position: 'relative',
    width: 'full',
  },
})
const inputClassName = cva({
  base: {
    _placeholder: { color: 'muted-foreground/72' },
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    boxShadow: 'none',
    color: 'foreground',
    fontSize: { base: 'base', sm: 'sm' },
    height: { base: '9.5', sm: '8.5' },
    lineHeight: { base: '2.375rem', sm: '2.125rem' },
    minWidth: '0',
    outline: 'none',
    paddingInlineEnd: '3',
    paddingInlineStart: { base: 'calc(2.125rem - 1px)', sm: 'calc(token(spacing.8) - 1px)' },
    transition: 'background-color 5000000s ease-in-out 0s',
    width: 'full',
  },
})
const addonClassName = cva({
  base: {
    '& svg': {
      '&:not([data-size])': { height: { base: '1.125rem', sm: '1rem' }, width: { base: '1.125rem', sm: '1rem' } },
      marginInline: '-0.125rem',
    },
    alignItems: 'center',
    display: 'flex',
    insetBlock: '0',
    insetInlineStart: '1px',
    opacity: '0.8',
    paddingInlineStart: 'calc(token(spacing.3) - 1px)',
    pointerEvents: 'none',
    position: 'absolute',
    zIndex: '10',
  },
})
const itemClassName = cva({
  base: {
    '&[data-disabled]': { opacity: '0.64', pointerEvents: 'none' },
    '&[data-highlighted]': { backgroundColor: 'accent', color: 'accent-foreground' },
    alignItems: 'center',
    borderRadius: 'sm',
    cursor: 'default',
    display: 'flex',
    fontSize: { base: 'base', sm: 'sm' },
    minHeight: { base: '8', sm: '7' },
    outline: 'none',
    paddingBlock: '1.5',
    paddingInline: '2',
    userSelect: 'none',
  },
})
const emptyClassName = cva({
  base: { '&:not(:empty)': { paddingBlock: '6' }, color: 'muted-foreground', fontSize: { base: 'base', sm: 'sm' }, textAlign: 'center' },
})
const listClassName = cva({
  base: { '&:not(:empty)': { padding: '2', scrollPaddingBlock: '2' }, '&[data-has-overflow-y]': { paddingInlineEnd: '3' } },
})
const backdropClassName = cva({
  base: {
    '&[data-ending-style], &[data-starting-style]': { opacity: '0' },
    backdropFilter: 'blur(4px)',
    backgroundColor: 'black/32',
    inset: '0',
    position: 'fixed',
    transition: 'opacity 200ms',
    zIndex: '50',
  },
})
const viewportClassName = cva({
  base: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    inset: '0',
    paddingBlock: 'max(token(spacing.4), 4vh)',
    paddingInline: '4',
    position: 'fixed',
    sm: { paddingBlock: '10vh' },
    zIndex: '50',
  },
})
const popupClassName = cva({
  base: {
    '&[data-ending-style], &[data-starting-style]': { opacity: '0', scale: '0.98' },
    '&[data-nested-dialog-open]': { transformOrigin: 'top' },
    '&[data-nested][data-ending-style], &[data-nested][data-starting-style]': { translate: '0 2rem' },
    _before: {
      backgroundColor: 'muted/72',
      borderRadius: 'calc(token(radii.2xl) - 1px)',
      boxShadow: '0 1px color-mix(in oklab, token(colors.black) 4%, transparent)',
      content: '""',
      inset: '0',
      pointerEvents: 'none',
      position: 'absolute',
    },
    _dark: { _before: { boxShadow: '0 -1px color-mix(in oklab, token(colors.white) 6%, transparent)' } },
    backgroundClip: 'padding-box',
    backgroundColor: 'popover',
    borderRadius: '2xl',
    borderWidth: '1px',
    boxShadow: 'overlay',
    color: 'popover-foreground',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '26.25rem',
    maxWidth: 'xl',
    minHeight: '0',
    minWidth: '0',
    opacity: 'calc(1 - 0.1 * var(--nested-dialogs))',
    outline: 'none',
    position: 'relative',
    scale: 'calc(1 - 0.1 * var(--nested-dialogs))',
    transitionDuration: '200ms',
    transitionProperty: 'scale, opacity, translate',
    transitionTimingFunction: 'in-out',
    translate: '0 calc(-1.25rem * var(--nested-dialogs))',
    width: 'full',
  },
})
const panelClassName = cva({
  base: {
    '&:not(:has(+ [data-slot=command-footer]))': {
      borderBottomRadius: '2xl',
      clipPath: 'inset(0 1px 1px 1px round 0 0 calc(token(radii.2xl) - 1px) calc(token(radii.2xl) - 1px))',
      marginBottom: '-1px',
    },
    _before: { borderTopRadius: 'calc(token(radii.xl) - 1px)', content: '""', inset: '0', pointerEvents: 'none', position: 'absolute' },
    backgroundClip: 'padding-box',
    backgroundColor: 'popover',
    borderBottomWidth: '0',
    borderTopRadius: 'xl',
    borderWidth: '1px',
    boxShadow: 'xs',
    clipPath: 'inset(0 1px)',
    marginInline: '-1px',
    minHeight: '0',
    position: 'relative',
  },
})
const footerClassName = cva({
  base: {
    alignItems: 'center',
    borderBottomRadius: 'calc(token(radii.2xl) - 1px)',
    borderTopWidth: '1px',
    color: 'muted-foreground',
    display: 'flex',
    fontSize: 'xs',
    gap: '2',
    justifyContent: 'space-between',
    paddingBlock: '3',
    paddingInline: '5',
    position: 'relative',
  },
})

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
  <AutocompletePrimitive.InputGroup className={inputGroupClassName()} data-slot="autocomplete-input-group">
    <div aria-hidden className={addonClassName()} data-slot="autocomplete-start-addon">
      <MagnifyingGlassIcon />
    </div>
    <AutocompletePrimitive.Input autoFocus className={inputClassName()} data-slot="autocomplete-input" placeholder={placeholder} />
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
    <CommandDialogPrimitive.Backdrop className={backdropClassName()} data-slot="command-dialog-backdrop" />
    <CommandDialogPrimitive.Viewport className={viewportClassName()} data-slot="command-dialog-viewport">
      <CommandDialogPrimitive.Popup aria-label={ariaLabel} className={popupClassName()} data-slot="command-dialog-popup">
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
  <div className={cva({ base: { paddingBlock: '1.5', paddingInline: '2.5' } })()}>
    <AutocompleteInput {...props} />
  </div>
)
export const CommandList = ({ children }: ListProps): React.ReactElement => (
  <ScrollArea scrollbarGutter="compact" scrollFade>
    <AutocompletePrimitive.List className={listClassName()} data-slot="command-list">
      {children}
    </AutocompletePrimitive.List>
  </ScrollArea>
)
export const CommandEmpty = ({ children }: EmptyProps): React.ReactElement => (
  <AutocompletePrimitive.Empty className={emptyClassName()} data-slot="command-empty">
    {children}
  </AutocompletePrimitive.Empty>
)
export const CommandPanel = ({ children }: PlainProps): React.ReactElement => (
  <div className={panelClassName()} data-slot="command-panel">
    {children}
  </div>
)
export const CommandItem = ({ children, onClick, value }: ItemProps): React.ReactElement => (
  <AutocompletePrimitive.Item className={itemClassName()} data-slot="command-item" onClick={onClick} value={value}>
    {children}
  </AutocompletePrimitive.Item>
)
export const CommandFooter = ({ children }: PlainProps): React.ReactElement => (
  <div className={footerClassName()} data-slot="command-footer">
    {children}
  </div>
)
