import { useId, type ReactNode } from 'react'

import { section, heading } from './story-section.css'

export interface StorySectionProps {
  children: ReactNode
  title: string
}

export const StorySection = ({ title, children }: StorySectionProps) => {
  const id = useId()
  return (
    <section aria-labelledby={id} className={section}>
      <h2 className={heading} id={id}>
        {title}
      </h2>
      {children}
    </section>
  )
}
