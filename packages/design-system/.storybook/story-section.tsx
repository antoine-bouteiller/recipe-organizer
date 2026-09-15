import { useId, type ReactNode } from 'react'

export const StorySection = ({ title, children }: { title: string; children: ReactNode }) => {
  const id = useId()
  return (
    <section aria-labelledby={id} className="space-y-4 border-b border-border pb-8 last:border-0 last:pb-0">
      <h2 className="text-lg font-semibold" id={id}>
        {title}
      </h2>
      {children}
    </section>
  )
}
