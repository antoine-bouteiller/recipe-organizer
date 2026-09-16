import { Toolbar as ToolbarPrimitive } from '@base-ui/react/toolbar'
import { css } from '@recipe-organizer/design-system/css'
import type React from 'react'

import { Toggle, type ToggleProps } from '../toggle/toggle'

const toolbarClassName = css({
  '--owner-icon-margin-inline': '0',
  '--owner-icon-opacity': '1',
  backgroundColor: 'card',
  borderRadius: 'xl',
  borderWidth: '1px',
  color: 'card-foreground',
  display: 'flex',
  gap: '2',
  overflow: 'auto',
  padding: '1',
  position: 'relative',
  width: 'full',
})
const toolbarGroupClassName = css({ alignItems: 'center', display: 'flex', gap: '1' })
const toolbarButtonClassName = css({
  '--owner-icon-margin-inline': '-0.125rem',
  '--owner-icon-opacity': '0.8',
  '--owner-icon-size': { base: '1.125rem', sm: '1rem' },
  '@media (pointer: coarse)': { _after: { display: 'block' } },
  _after: { content: '""', display: 'none', inset: '0', minHeight: '11', minWidth: '11', position: 'absolute' },
  _disabled: { opacity: 0.64, pointerEvents: 'none' },
  _focusVisible: { outline: '2px solid token(colors.ring)', outlineOffset: '1px', zIndex: '10' },
  _hover: { backgroundColor: 'accent' },
  alignItems: 'center',
  borderColor: 'transparent',
  borderRadius: 'lg',
  borderWidth: '1px',
  cursor: 'pointer',
  display: 'inline-flex',
  fontSize: { base: 'base', sm: 'sm' },
  fontWeight: 'medium',
  gap: '2',
  height: { base: '9', sm: '8' },
  justifyContent: 'center',
  minWidth: { base: '9', sm: '8' },
  paddingInline: 'calc(token(spacing.2) - 1px)',
  position: 'relative',
  userSelect: 'none',
  whiteSpace: 'nowrap',
})
const toolbarSeparatorClassName = css({
  '&[data-orientation=horizontal]': { height: '1px', marginBlock: '0.5', marginInline: '0', width: 'full' },
  alignSelf: 'stretch',
  backgroundColor: 'border',
  flexShrink: '0',
  marginBlock: '1.5',
  width: '1px',
})

export type ToolbarProps = Pick<ToolbarPrimitive.Root.Props, 'aria-label' | 'children'>
export const Toolbar = (props: ToolbarProps): React.ReactElement => (
  <ToolbarPrimitive.Root {...props} className={toolbarClassName} data-slot="toolbar" />
)

export type ToolbarButtonProps = Pick<ToolbarPrimitive.Button.Props, 'aria-label' | 'children'>
export const ToolbarButton = (props: ToolbarButtonProps): React.ReactElement => (
  <ToolbarPrimitive.Button {...props} className={toolbarButtonClassName} data-slot="toolbar-button" />
)

export type ToolbarGroupProps = Pick<ToolbarPrimitive.Group.Props, 'aria-label' | 'children'>
export const ToolbarGroup = (props: ToolbarGroupProps): React.ReactElement => (
  <ToolbarPrimitive.Group {...props} className={toolbarGroupClassName} data-slot="toolbar-group" />
)

export type ToolbarSeparatorProps = Pick<ToolbarPrimitive.Separator.Props, 'aria-label'>
export const ToolbarSeparator = (props: ToolbarSeparatorProps): React.ReactElement => (
  <ToolbarPrimitive.Separator {...props} className={toolbarSeparatorClassName} data-slot="toolbar-separator" />
)

export type ToolbarToggleProps = Pick<ToggleProps, 'aria-label' | 'children' | 'disabled' | 'onClick' | 'pressed' | 'value'>
export const ToolbarToggle = ({ children, ...props }: ToolbarToggleProps): React.ReactElement => (
  <ToolbarPrimitive.Button render={<Toggle {...props} />}>{children}</ToolbarPrimitive.Button>
)
