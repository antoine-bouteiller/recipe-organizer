import { cn } from 'cn'
import type React from 'react'

export const GlassPill = ({ children, className, on }: { children: React.ReactNode; className?: string; on: boolean }) => (
  <div className={cn('pointer-events-auto relative', className)}>
    {/* Blur sits on an absolute child, not the box itself: backdrop-filter inside a sticky box smears during iOS momentum scroll, and fading a child's opacity carries the blur along with the tint (transition-colors would not). */}
    <div
      className={cn(
        'absolute inset-0 rounded-full border border-border/60 bg-background/80 backdrop-blur-xl transition-opacity duration-200 ease-out-snappy',
        on ? 'opacity-100' : 'opacity-0'
      )}
    />
    <div className="relative">{children}</div>
  </div>
)
