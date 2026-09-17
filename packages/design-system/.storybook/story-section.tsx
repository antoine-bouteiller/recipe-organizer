import { useId, type ReactNode } from 'react'

import * as styles from './story-section.css'

export interface StorySectionProps {
  children: ReactNode
  title: string
}

export const StorySection = ({ title, children }: StorySectionProps) => {
  const id = useId()
  return (
    <section aria-labelledby={id} className={styles.section}>
      <h2 className={styles.heading} id={id}>
        {title}
      </h2>
      {children}
    </section>
  )
}
