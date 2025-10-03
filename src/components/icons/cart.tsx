import { LucideShoppingCart } from 'lucide-react'

export const ShoppingCartIcon = ({
  className,
  filled,
}: {
  className?: string
  filled?: boolean
}) => <LucideShoppingCart className={className} fill={filled ? 'currentColor' : 'none'} />
