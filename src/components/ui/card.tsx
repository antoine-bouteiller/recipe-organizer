import { type ReactElement, type ReactNode } from 'react'

import { cn } from '@/utils/cn'

interface CardProps {
  title?: ReactNode
  description?: ReactNode
  className?: string
  children?: ReactNode
}

export const Card = ({ title, description, className, children }: CardProps): ReactElement => {
  const hasHeader = title !== undefined || description !== undefined

  return (
    <div
      className={cn(
        `relative flex flex-col rounded-2xl border bg-card text-card-foreground shadow-xs/5 not-dark:bg-clip-padding before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-2xl)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]`,
        className
      )}
      data-slot="card"
    >
      {hasHeader && (
        <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 p-6" data-slot="card-header">
          {title !== undefined && (
            <div className="text-lg leading-none font-semibold" data-slot="card-title">
              {title}
            </div>
          )}
          {description !== undefined && (
            <div className="text-sm text-muted-foreground" data-slot="card-description">
              {description}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  )
}
