import { Toolbar as ToolbarPrimitive } from '@base-ui/react/toolbar'
import type React from 'react'

import { Toggle, type ToggleProps } from '../toggle/toggle'

import * as styles from './toolbar.css'

export type ToolbarProps = Pick<ToolbarPrimitive.Root.Props, 'aria-label' | 'children'>
export const Toolbar = (props: ToolbarProps): React.ReactElement => (
  <ToolbarPrimitive.Root {...props} className={styles.toolbar} data-slot="toolbar" />
)

export type ToolbarButtonProps = Pick<ToolbarPrimitive.Button.Props, 'aria-label' | 'children'>
export const ToolbarButton = (props: ToolbarButtonProps): React.ReactElement => (
  <ToolbarPrimitive.Button {...props} className={styles.toolbarButton} data-slot="toolbar-button" />
)

export type ToolbarGroupProps = Pick<ToolbarPrimitive.Group.Props, 'aria-label' | 'children'>
export const ToolbarGroup = (props: ToolbarGroupProps): React.ReactElement => (
  <ToolbarPrimitive.Group {...props} className={styles.toolbarGroup} data-slot="toolbar-group" />
)

export type ToolbarSeparatorProps = Pick<ToolbarPrimitive.Separator.Props, 'aria-label'>
export const ToolbarSeparator = (props: ToolbarSeparatorProps): React.ReactElement => (
  <ToolbarPrimitive.Separator {...props} className={styles.toolbarSeparator} data-slot="toolbar-separator" />
)

export type ToolbarToggleProps = Pick<ToggleProps, 'aria-label' | 'children' | 'disabled' | 'onClick' | 'pressed' | 'value'>
export const ToolbarToggle = ({ children, ...props }: ToolbarToggleProps): React.ReactElement => (
  <ToolbarPrimitive.Button render={<Toggle {...props} />}>{children}</ToolbarPrimitive.Button>
)
