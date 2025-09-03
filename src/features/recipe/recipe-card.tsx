import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Recipe } from '@/types/recipe'
import { Link } from '@tanstack/react-router'

interface RecipeCardProps {
  recipe: Pick<Recipe, 'id' | 'name' | 'image'>
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link to="/recipe/$id" params={{ id: recipe.id.toString() }}>
      <Card
        key={recipe.id}
        className="cursor-pointer gap-2 py-0 transition-all duration-300 hover:scale-105 hover:shadow-lg "
      >
        <CardHeader className="relative p-0">
          <div className="relative h-36 w-full overflow-hidden">
            <img src={recipe.image} alt={recipe.name} className="object-cover w-full h-full" />
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-2">
          <CardTitle className="mb-2 line-clamp-2 text-xl font-bold text-nowrap text-ellipsis">
            {recipe.name}
          </CardTitle>
        </CardContent>
      </Card>
    </Link>
  )
}
