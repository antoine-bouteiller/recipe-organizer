import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { CaretUpDownIcon } from '@recipe-organizer/design-system/icons/caret-up-down'
import { type ButtonHTMLAttributes, type ReactElement } from 'react'

import { type SelectProps } from './select'

import * as styles from './select.shared.css'

const selectText = (empty: boolean): string => `${styles.selectText} ${styles.selectTextState[empty ? 'empty' : 'selected']}`

export const SelectButton = ({ render, children, ...props }: useRender.ComponentProps<'button'>): ReactElement => {
  const type: ButtonHTMLAttributes<HTMLButtonElement>['type'] = render ? undefined : 'button'
  const mergedProps = mergeProps<'button'>(
    {
      children: (
        <>
          <span className={selectText(false)}>{children}</span>
          <span className={styles.selectTriggerIcon}>
            <CaretUpDownIcon />
          </span>
        </>
      ),
      className: styles.selectTrigger,
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

export { selectText }
