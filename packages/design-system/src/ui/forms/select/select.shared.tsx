import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { css } from '@recipe-organizer/design-system/css'
import { type ButtonHTMLAttributes, type ReactElement } from 'react'

import { CaretUpDownIcon } from '../../data-display/icons/caret-up-down'
import { type SelectProps } from './select'

const selectTriggerClassName = css({
  '& svg': { flexShrink: 0, pointerEvents: 'none' },
  '&:focus-visible': { borderColor: 'ring', boxShadow: '0 0 0 3px color-mix(in oklab, token(colors.ring) 24%, transparent)' },
  '&:focus-visible[aria-invalid]': {
    borderColor: 'destructive/64',
    boxShadow: '0 0 0 3px color-mix(in oklab, token(colors.destructive) 16%, transparent)',
  },
  '&:not([data-disabled], :focus-visible, [aria-invalid], [data-pressed])::before': {
    boxShadow: '0 1px color-mix(in oklab, token(colors.black) 4%, transparent)',
  },
  '&[aria-invalid]': { borderColor: 'destructive/36', boxShadow: 'none' },
  '&[data-disabled]': { opacity: 0.64, pointerEvents: 'none' },
  '&[data-pressed]': { boxShadow: 'none' },
  '--owner-icon-opacity': '0.8',
  '--owner-icon-size': { base: '1.125rem', sm: '1rem' },
  '@media (pointer: coarse)': { _after: { content: '""', inset: '0', minHeight: '11', position: 'absolute' } },
  _before: { borderRadius: 'calc(token(radii.lg) - 1px)', content: '""', inset: '0', pointerEvents: 'none', position: 'absolute' },
  _dark: {
    '&:focus-visible[aria-invalid]': { boxShadow: '0 0 0 3px color-mix(in oklab, token(colors.destructive) 24%, transparent)' },
    '&:not([data-disabled], :focus-visible, [aria-invalid], [data-pressed])::before': {
      boxShadow: '0 -1px color-mix(in oklab, token(colors.white) 6%, transparent)',
    },
  },
  alignItems: 'center',
  backgroundClip: 'padding-box',
  backgroundColor: { _dark: 'input/32', base: 'background' },
  borderColor: 'input',
  borderRadius: 'lg',
  borderWidth: '1px',
  color: 'foreground',
  display: 'inline-flex',
  fontSize: { base: 'base', sm: 'sm' },
  gap: '2',
  justifyContent: 'space-between',
  minHeight: { base: '9', sm: '8' },
  minWidth: '36',
  outline: 'none',
  paddingInline: 'calc(token(spacing.3) - 1px)',
  position: 'relative',
  ringColor: 'ring/24',
  textAlign: 'left',
  transitionDuration: '150ms',
  transitionProperty: 'box-shadow',
  transitionTimingFunction: 'in-out',
  userSelect: 'none',
  width: 'full',
})
const selectTriggerIconClassName = css({ marginInlineEnd: '-1', opacity: 0.8 })
const selectTextClassName = (empty: boolean): string =>
  css({
    color: empty ? 'muted-foreground' : undefined,
    flex: '1',
    overflow: 'hidden',
    textAlign: 'left',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  })

export const SelectButton = ({ render, children, ...props }: useRender.ComponentProps<'button'>): ReactElement => {
  const type: ButtonHTMLAttributes<HTMLButtonElement>['type'] = render ? undefined : 'button'
  const mergedProps = mergeProps<'button'>(
    {
      children: (
        <>
          <span className={selectTextClassName(false)}>{children}</span>
          <span className={selectTriggerIconClassName}>
            <CaretUpDownIcon />
          </span>
        </>
      ),
      className: selectTriggerClassName,
      type,
    },
    props
  )
  return useRender({ defaultTagName: 'button', props: { ...mergedProps, 'data-slot': 'select-button' }, render })
}

export const getSelectDisplay = <TValue extends string>(props: SelectProps<TValue>) => {
  const { items, placeholder = 'Sélectionner' } = props
  const isSelected = (value: string | null): boolean =>
    props.multiple ? props.value.some((item) => item === value) : (props.value ?? null) === value
  const selectedLabels = items.filter((item) => isSelected(item.value)).map((item) => item.label)
  const isEmpty = selectedLabels.length === 0
  return {
    displayLabel: isEmpty ? placeholder : selectedLabels[0] + (selectedLabels.length > 1 ? ` (+${selectedLabels.length - 1})` : ''),
    isEmpty,
    isSelected,
  }
}

export { selectTextClassName, selectTriggerClassName, selectTriggerIconClassName }
