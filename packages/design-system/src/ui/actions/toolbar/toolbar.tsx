import { Toolbar as ToolbarPrimitive } from '@base-ui/react/toolbar'
import type React from 'react'

import * as styles from './toolbar.css'

export type ToolbarGroupProps = Pick<ToolbarPrimitive.Group.Props, 'aria-label' | 'children'>
export const ToolbarGroup = (props: ToolbarGroupProps): React.ReactElement => (
  <ToolbarPrimitive.Group {...props} className={styles.toolbarGroup} data-slot="toolbar-group" />
)

export type ToolbarSeparatorProps = Pick<ToolbarPrimitive.Separator.Props, 'aria-label'>
export const ToolbarSeparator = (props: ToolbarSeparatorProps): React.ReactElement => (
  <ToolbarPrimitive.Separator {...props} className={styles.toolbarSeparator} data-slot="toolbar-separator" />
)
