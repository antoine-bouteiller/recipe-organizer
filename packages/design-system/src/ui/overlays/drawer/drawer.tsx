import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer'
import type React from 'react'

import { Button } from '../../actions/button/button'
import { ScrollArea } from '../../layout/scroll-area/scroll-area'

import {
  backdropClassName,
  viewportClassName,
  popupClassName,
  headerClassName,
  footerClassName,
  titleClassName,
  panelClassName,
  barClassName,
  container,
} from './drawer.css'

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
  <div className={container()}>
    <ScrollArea scrollFade>
      <DrawerPrimitive.Content className={panelClassName()} data-slot="drawer-panel">
        {children}
      </DrawerPrimitive.Content>
    </ScrollArea>
  </div>
)
