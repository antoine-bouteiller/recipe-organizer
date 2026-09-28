import type React from 'react'

import * as styles from './scroll-area.css'

export type ScrollAreaProps = Pick<React.ComponentProps<'div'>, 'aria-label' | 'children'> & {
  scrollbarGutter?: boolean | 'compact'
}

// Publishes overflow attributes so styles can reserve gutters.
const trackOverflow = (element: HTMLDivElement): (() => void) => {
  const update = (): void => {
    const { clientHeight, clientWidth, scrollHeight, scrollWidth } = element
    element.toggleAttribute('data-has-overflow-x', scrollWidth > clientWidth)
    element.toggleAttribute('data-has-overflow-y', scrollHeight > clientHeight)
  }
  const observer = new ResizeObserver(update)
  observer.observe(element)
  for (const child of element.children) {
    observer.observe(child)
  }
  return () => observer.disconnect()
}

export const ScrollArea = ({ 'aria-label': ariaLabel, children, scrollbarGutter = false }: ScrollAreaProps): React.ReactElement => (
  <div aria-label={ariaLabel} className={styles.viewport({ scrollbarGutter })} data-slot="scroll-area-viewport" ref={trackOverflow}>
    {children}
  </div>
)
