import type { RecipeSection } from '@/features/recipe/api/get-one'

interface RecipeSectionIngredientsProps {
  sectionIngredients: RecipeSection['sectionIngredients']
}

export const RecipeSectionIngredients = ({ sectionIngredients }: RecipeSectionIngredientsProps) =>
  sectionIngredients.length > 0 && (
    <ul className="list-disc list-outside space-y-2 pl-4">
      {sectionIngredients.map((sectionIngredient) => (
        <li key={sectionIngredient.id}>
          <div className="flex items-center justify-between gap-2">
            <div>{sectionIngredient.ingredient.name}</div>
            <div className="font-medium">
              {sectionIngredient.quantity}
              {sectionIngredient.unit && ` ${sectionIngredient.unit}`}
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
