import type { Recipe, RecipeSection } from '@/features/recipe/api/get-one'

import { formatNumber } from '@/utils/number'

interface RecipeSectionIngredientsProps {
  baseQuantity: number
  quantity: number
  sectionIngredients: RecipeSection['sectionIngredients']
}

const RecipeSectionIngredients = ({ baseQuantity, quantity, sectionIngredients }: RecipeSectionIngredientsProps) =>
  sectionIngredients.length > 0 && (
    <ul
      className={`
        mt-0 mb-0 space-y-2 pr-4
        md:pr-2
      `}
    >
      {sectionIngredients.map((sectionIngredient) => (
        <li key={sectionIngredient.id}>
          <div
            className={`
              flex items-center justify-between gap-2 text-nowrap text-ellipsis
            `}
          >
            <div>{sectionIngredient.ingredient.name}</div>
            <div className="font-medium">
              {formatNumber((sectionIngredient.quantity * quantity) / baseQuantity)}
              {sectionIngredient.unit && ` ${sectionIngredient.unit.name}`}
            </div>
          </div>
        </li>
      ))}
    </ul>
  )

interface RecipeIngredientsSectionsProps {
  baseQuantity: number
  quantity: number
  sections: Recipe['sections']
}

export const RecipeIngredientsSections = ({ baseQuantity, quantity, sections }: RecipeIngredientsSectionsProps) =>
  sections.map((section) => (
    <div key={section.id}>
      {section.name && <div className="font-semibold">{section.name}</div>}

      <RecipeSectionIngredients baseQuantity={baseQuantity} quantity={quantity} sectionIngredients={section.sectionIngredients} />

      {section.subRecipe && (
        <RecipeSectionIngredients
          baseQuantity={baseQuantity}
          quantity={quantity}
          sectionIngredients={section.subRecipe.sections[0].sectionIngredients}
        />
      )}
    </div>
  ))
