import { cn } from '@/lib/utils'
import { LucideSearch } from 'lucide-react'

export const SearchIcon = ({ className, filled }: { className?: string; filled?: boolean }) => (
  <LucideSearch name="search" className={cn(className, filled && 'stroke-3')} />
)
