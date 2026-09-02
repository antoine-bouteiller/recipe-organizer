import { cn } from 'cn'

import { Badge } from '@/components/ui/badge'
import { type IngredientCategory } from '@/types/ingredient'

const categoryStyles = {
  fish: 'bg-blue-200 text-blue-600',
  meat: 'bg-red-200 text-red-600',
  other: 'bg-zinc-200 text-zinc-700',
  spices: 'bg-yellow-200 text-yellow-600',
  vegetables: 'bg-emerald-100 text-emerald-600',
} satisfies Record<IngredientCategory, string>

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
