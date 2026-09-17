import { ScrollArea as ScrollAreaPrimitive } from '@base-ui/react/scroll-area'
import type React from 'react'

import * as styles from './scroll-area.css'

export type ScrollAreaProps = Pick<ScrollAreaPrimitive.Root.Props, 'aria-label' | 'children'> & {
  scrollFade?: boolean
  scrollbarGutter?: boolean | 'compact'
}

export const ScrollArea = ({
  'aria-label': ariaLabel,
  children,
  scrollFade = false,
  scrollbarGutter = false,
}: ScrollAreaProps): React.ReactElement => (
  <ScrollAreaPrimitive.Root aria-label={ariaLabel} className={styles.root()} data-slot="scroll-area">
    <ScrollAreaPrimitive.Viewport className={styles.viewport({ scrollFade, scrollbarGutter })} data-slot="scroll-area-viewport">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar compact={scrollbarGutter === 'compact'} orientation="vertical" />
    <ScrollBar compact={scrollbarGutter === 'compact'} orientation="horizontal" />
    <ScrollAreaPrimitive.Corner data-slot="scroll-area-corner" />
  </ScrollAreaPrimitive.Root>
)

const ScrollBar = ({ compact, orientation }: { compact: boolean; orientation: 'horizontal' | 'vertical' }): React.ReactElement => (
  <ScrollAreaPrimitive.Scrollbar className={styles.scrollbar({ compact, orientation })} data-slot="scroll-area-scrollbar" orientation={orientation}>
    <ScrollAreaPrimitive.Thumb className={styles.thumb()} data-slot="scroll-area-thumb" />
  </ScrollAreaPrimitive.Scrollbar>
)
