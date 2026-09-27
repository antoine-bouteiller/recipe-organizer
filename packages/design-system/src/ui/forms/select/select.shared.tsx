import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { CaretUpDownIcon } from '@recipe-organizer/design-system/icons/caret-up-down'
import type { ButtonHTMLAttributes, ReactElement } from 'react'

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
