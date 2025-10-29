import { cn } from '@/lib/utils'
import { Card } from './ui/card'

export const CardLayout = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => (
  <div className="md:min-h-full max-w-5xl md:mx-auto relative md:p-8 w-full">
    <Card
      className={cn(
        'pt-0 relative gap-2 md:gap-6 border-none shadow-none rounded-none md:border md:shadow-sm md:rounded-xl flex-1 flex flex-col bg-background md:bg-card',
        className
      )}
    >
      {children}
    </Card>
  </div>
)
