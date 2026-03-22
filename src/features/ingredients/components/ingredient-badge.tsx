import { Badge } from '@/components/ui/badge'
import type { IngredientCategory } from '@/types/ingredient'
import { cn } from '@/utils/cn'

const categoryStyles: Record<IngredientCategory, string> = {
  fish: 'bg-blue-200 text-blue-600',
  meat: 'bg-red-200 text-red-600',
  other: 'bg-zinc-200 text-zinc-700',
  spices: 'bg-yellow-200 text-yellow-600',
  vegetables: 'bg-emerald-100 text-emerald-600',
}

export const IngredientBadge = ({
  category,
  children,
  className,
}: {
  category: IngredientCategory
  children: React.ReactNode
  className?: string
}) => (
  <Badge className={cn(categoryStyles[category], className)} data-slot="badge">
    {children}
  </Badge>
)
