import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer'
import { ScrollArea } from '@design-system/ui/layout/scroll-area/scroll-area'
import { Button } from '@recipe-organizer/design-system/button'
import type React from 'react'

import * as styles from './drawer.css'

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
    <DrawerPrimitive.Backdrop className={styles.backdrop()} data-slot="drawer-backdrop" />
    <DrawerPrimitive.Viewport className={styles.viewport()} data-slot="drawer-viewport">
      <DrawerPrimitive.Popup className={styles.popup()} data-slot="drawer-popup">
        {children}
        <div aria-hidden className={styles.bar()} data-slot="drawer-bar" />
      </DrawerPrimitive.Popup>
    </DrawerPrimitive.Viewport>
  </DrawerPrimitive.Portal>
)
export const DrawerHeader = ({ children }: DrawerHeaderProps): React.ReactElement => (
  <div className={styles.header()} data-slot="drawer-header">
    {children}
  </div>
)
export const DrawerFooter = ({ children }: DrawerContentProps): React.ReactElement => (
  <DrawerPrimitive.Content className={styles.footer()} data-slot="drawer-footer">
    {children}
  </DrawerPrimitive.Content>
)
export const DrawerTitle = ({ children }: DrawerTitleProps): React.ReactElement => (
  <DrawerPrimitive.Title className={styles.title()} data-slot="drawer-title">
    {children}
  </DrawerPrimitive.Title>
)
export const DrawerPanel = ({ children }: DrawerContentProps): React.ReactElement => (
  <div className={styles.container()}>
    <ScrollArea scrollFade>
      <DrawerPrimitive.Content className={styles.panel()} data-slot="drawer-panel">
        {children}
      </DrawerPrimitive.Content>
    </ScrollArea>
  </div>
)
