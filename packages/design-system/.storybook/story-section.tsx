import { css } from '@recipe-organizer/design-system/css'
import { useId, type ReactNode } from 'react'

export interface StorySectionProps {
  children: ReactNode
  title: string
}

export const StorySection = ({ title, children }: StorySectionProps) => {
  const id = useId()
  return (
    <section
      aria-labelledby={id}
      className={css({
        '& > * + *': { marginTop: '4' },
        '&:last-child': { borderBottomWidth: '0', paddingBottom: '0' },
        borderBottomWidth: '1px',
        borderColor: 'border',
        paddingBottom: '8',
      })}
    >
      <h2 className={css({ fontSize: 'lg', fontWeight: 'semibold' })} id={id}>
        {title}
      </h2>
      {children}
    </section>
  )
}
