import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer'
import { cva } from '@recipe-organizer/design-system/css'
import type React from 'react'

import { Button } from '../../actions/button/button'
import { ScrollArea } from '../../layout/scroll-area/scroll-area'

const backdropClassName = cva({
  base: {
    '&[data-ending-style]': { transitionDuration: 'calc(var(--drawer-swipe-strength) * 400ms)' },
    '&[data-ending-style], &[data-starting-style]': { opacity: '0' },
    '&[data-swiping]': { transitionDuration: '0ms' },
    '@supports (-webkit-touch-callout: none)': { position: 'absolute' },
    backdropFilter: 'blur(4px)',
    backgroundColor: 'black/32',
    inset: '0',
    opacity: 'calc(1 - var(--drawer-swipe-progress))',
    position: 'fixed',
    transition: 'opacity 450ms token(easings.out-snappy)',
    zIndex: '50',
  },
})
const viewportClassName = cva({
  base: {
    '--bleed': 'token(spacing.12)',
    display: 'grid',
    gridTemplateRows: '1fr auto',
    inset: '0',
    paddingTop: '12',
    position: 'fixed',
    touchAction: 'none',
    zIndex: '50',
  },
})
const popupClassName = cva({
  base: {
    '&:has([data-slot=drawer-bar])': { paddingTop: '2' },
    '&[data-ending-style]': { transitionDuration: 'calc(var(--drawer-swipe-strength) * 400ms)' },
    '&[data-ending-style], &[data-starting-style]': {
      boxShadow: 'none',
      paddingBottom: '0',
      translate: '0 calc(100% + env(safe-area-inset-bottom, 0px))',
    },
    '&[data-swiping]': { userSelect: 'none' },
    _after: {
      backgroundColor: 'popover',
      content: '""',
      height: 'var(--bleed)',
      insetBlockStart: '100%',
      insetInline: '0',
      pointerEvents: 'none',
      position: 'absolute',
    },
    _before: {
      borderTopRadius: 'calc(token(radii.2xl) - 1px)',
      boxShadow: '0 1px color-mix(in oklab, token(colors.black) 4%, transparent)',
      content: '""',
      inset: '0',
      pointerEvents: 'none',
      position: 'absolute',
    },
    _dark: { _before: { boxShadow: '0 -1px color-mix(in oklab, token(colors.white) 6%, transparent)' } },
    backgroundClip: 'padding-box',
    backgroundColor: 'popover',
    borderTopRadius: '2xl',
    borderTopWidth: '1px',
    boxShadow: 'overlay',
    color: 'popover-foreground',
    display: 'flex',
    flexDirection: 'column',
    gridRowStart: '2',
    maxHeight: 'full',
    minHeight: '0',
    minWidth: '0',
    outline: 'none',
    paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    position: 'relative',
    touchAction: 'none',
    transitionDuration: '450ms',
    transitionProperty: 'translate, box-shadow, height, background-color',
    transitionTimingFunction: 'out-snappy',
    translate: '0 var(--drawer-swipe-movement-y)',
    width: 'full',
  },
})
const headerClassName = cva({
  base: {
    '&:has(+ [data-slot=drawer-panel])': { paddingBottom: '3' },
    cursor: 'default',
    display: 'flex',
    flexDirection: 'column',
    gap: '2',
    padding: '6',
    smDown: { paddingBottom: '4' },
  },
})
const footerClassName = cva({
  base: {
    backgroundColor: 'muted/72',
    borderTopWidth: '1px',
    display: 'flex',
    flexDirection: 'column-reverse',
    gap: '2',
    paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + token(spacing.4))',
    paddingInline: '6',
    paddingTop: '4',
    sm: { flexDirection: 'row', justifyContent: 'flex-end' },
  },
})
const titleClassName = cva({ base: { fontFamily: 'heading', fontSize: 'xl', fontWeight: 'semibold', lineHeight: 'none' } })
const panelClassName = cva({
  base: {
    '[data-slot=drawer-popup]:has([data-slot=drawer-header]) &': { paddingTop: '1' },
    padding: '6',
  },
})
const barClassName = cva({
  base: {
    '&::before': { backgroundColor: 'input', borderRadius: 'full', content: '""', height: '1', width: '12' },
    alignItems: 'center',
    display: 'flex',
    insetBlockStart: '0',
    insetInline: '0',
    justifyContent: 'center',
    padding: '3',
    pointerEvents: 'none',
    position: 'absolute',
    touchAction: 'none',
  },
})

type DrawerRootProps = Pick<DrawerPrimitive.Root.Props, 'children' | 'onOpenChange' | 'open'>
type DrawerTriggerProps = Pick<DrawerPrimitive.Trigger.Props, 'children' | 'render'>
type DrawerCloseProps = Pick<DrawerPrimitive.Close.Props, 'children' | 'disabled' | 'render'>
type DrawerPopupProps = Pick<DrawerPrimitive.Popup.Props, 'children'>
type DrawerHeaderProps = Pick<React.ComponentProps<'div'>, 'children'>
type DrawerContentProps = Pick<DrawerPrimitive.Content.Props, 'children'>
type DrawerTitleProps = Pick<DrawerPrimitive.Title.Props, 'children'>

const defaultDrawerActionRender = <Button />

export const Drawer = ({ children, onOpenChange, open }: DrawerRootProps): React.ReactElement => (
  <DrawerPrimitive.Root onOpenChange={onOpenChange} open={open} swipeDirection="down">
    {children}
  </DrawerPrimitive.Root>
)
export const DrawerTrigger = ({ children, render = defaultDrawerActionRender }: DrawerTriggerProps): React.ReactElement => (
  <DrawerPrimitive.Trigger data-slot="drawer-trigger" render={render}>
    {children}
  </DrawerPrimitive.Trigger>
)
export const DrawerClose = ({ children, disabled, render = defaultDrawerActionRender }: DrawerCloseProps): React.ReactElement => (
  <DrawerPrimitive.Close data-slot="drawer-close" disabled={disabled} render={render}>
    {children}
  </DrawerPrimitive.Close>
)
export const DrawerPopup = ({ children }: DrawerPopupProps): React.ReactElement => (
  <DrawerPrimitive.Portal>
    <DrawerPrimitive.Backdrop className={backdropClassName()} data-slot="drawer-backdrop" />
    <DrawerPrimitive.Viewport className={viewportClassName()} data-slot="drawer-viewport">
      <DrawerPrimitive.Popup className={popupClassName()} data-slot="drawer-popup">
        {children}
        <div aria-hidden className={barClassName()} data-slot="drawer-bar" />
      </DrawerPrimitive.Popup>
    </DrawerPrimitive.Viewport>
  </DrawerPrimitive.Portal>
)
export const DrawerHeader = ({ children }: DrawerHeaderProps): React.ReactElement => (
  <div className={headerClassName()} data-slot="drawer-header">
    {children}
  </div>
)
export const DrawerFooter = ({ children }: DrawerContentProps): React.ReactElement => (
  <DrawerPrimitive.Content className={footerClassName()} data-slot="drawer-footer">
    {children}
  </DrawerPrimitive.Content>
)
export const DrawerTitle = ({ children }: DrawerTitleProps): React.ReactElement => (
  <DrawerPrimitive.Title className={titleClassName()} data-slot="drawer-title">
    {children}
  </DrawerPrimitive.Title>
)
export const DrawerPanel = ({ children }: DrawerContentProps): React.ReactElement => (
  <div className={cva({ base: { minHeight: '0', touchAction: 'auto' } })()}>
    <ScrollArea scrollFade>
      <DrawerPrimitive.Content className={panelClassName()} data-slot="drawer-panel">
        {children}
      </DrawerPrimitive.Content>
    </ScrollArea>
  </div>
)
