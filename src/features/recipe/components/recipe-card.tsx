import { ClientOnly, Link } from '@tanstack/react-router'

import { Badge } from '@/components/ui/badge'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/utils/cn'

import { type ReducedRecipe } from '../api/get-all'
import { RECIPE_TAG_LABELS } from '../utils/constants'
import { QuantityControls } from './quantity-controls'

interface RecipeCardProps {
  readonly recipe: ReducedRecipe
}

export default function RecipeCard({ recipe }: Readonly<RecipeCardProps>) {
  return (
    <Link params={{ id: recipe.id.toString() }} to="/recipe/$id" viewTransition>
      <Card className="relative min-h-60 cursor-pointer justify-end gap-2 overflow-hidden bg-center py-4" key={recipe.id}>
        <img src={recipe.image} alt={recipe.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-4/5 rounded-b-2xl bg-white/30 mask-[linear-gradient(to_bottom,transparent,black_40%)] backdrop-blur-sm" />
        <CardHeader className="relative px-4 py-2">
          <CardTitle className="flex items-center gap-2 overflow-hidden font-heading">
            <h2 className="overflow-hidden text-2xl font-semibold text-nowrap text-ellipsis text-white">{recipe.name}</h2>
          </CardTitle>
          <CardDescription className="flex flex-wrap gap-2">
            {recipe.tags.map((tag) => (
              <Badge key={tag} variant="outline" className={cn(tag === 'vegetarian' && 'bg-emerald-100 text-emerald-600')}>
                {RECIPE_TAG_LABELS[tag]}
              </Badge>
            ))}
          </CardDescription>
        </CardHeader>
        <CardFooter className="relative flex-none px-4 py-0">
          <ClientOnly fallback={<Skeleton className="h-8 w-full rounded-md" />}>
            <QuantityControls
              className="flex w-full items-center justify-between gap-2"
              recipeId={recipe.id}
              servings={recipe.servings}
              variant="card"
            />
          </ClientOnly>
        </CardFooter>
      </Card>
    </Link>
  )
}
