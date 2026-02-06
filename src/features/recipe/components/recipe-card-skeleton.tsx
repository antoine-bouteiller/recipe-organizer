import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const RecipeCardSkeleton = () => (
  <Card className="relative min-h-60 justify-end gap-2 overflow-hidden py-4">
    <Skeleton className="absolute inset-0 rounded-xl" />
    <CardHeader className="relative z-10 px-4">
      <CardTitle>
        <Skeleton className="h-8 w-3/4" />
      </CardTitle>
      <CardDescription className="flex gap-2">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </CardDescription>
    </CardHeader>
    <CardContent className="relative z-10 px-4">
      <Skeleton className="h-9 w-full rounded-md" />
    </CardContent>
  </Card>
)
