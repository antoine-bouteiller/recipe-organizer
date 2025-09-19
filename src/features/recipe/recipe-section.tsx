import type { Recipe, RecipeSection } from '@/features/recipe/api/get-one'
import { Fragment } from 'react/jsx-runtime'

interface RecipeSectionIngredientsProps {
  sectionIngredients: RecipeSection['sectionIngredients']
  quantity: number
  baseQuantity: number
}

const RecipeSectionIngredients = ({
  sectionIngredients,
  quantity,
  baseQuantity,
}: RecipeSectionIngredientsProps) =>
  sectionIngredients.length > 0 && (
    <ul className="space-y-2 pr-4 md:pr-2 mt-0 mb-0">
      {sectionIngredients.map((sectionIngredient) => (
        <li key={sectionIngredient.id}>
          <div className="flex items-center justify-between gap-2 text-nowrap text-ellipsis">
            <div>{sectionIngredient.ingredient.name}</div>
            <div className="font-medium">
              {(sectionIngredient.quantity * quantity) / baseQuantity}
              {sectionIngredient.unit && ` ${sectionIngredient.unit}`}
            </div>
          </div>
        </li>
      ))}
    </ul>
  )

interface RecipeIngredientsSectionsProps {
  sections: Recipe['sections']
  quantity: number
  baseQuantity: number
}

export const RecipeIngredientsSections = ({
  sections,
  quantity,
  baseQuantity,
}: RecipeIngredientsSectionsProps) =>
  sections.map((section) => (
    <Fragment key={section.id}>
      {section.name && <h3 className="mb-1 text-md font-semibold">{section.name}</h3>}

      <RecipeSectionIngredients
        sectionIngredients={section.sectionIngredients}
        quantity={quantity}
        baseQuantity={baseQuantity}
      />

      {section.subRecipe && (
        <RecipeSectionIngredients
          sectionIngredients={section.subRecipe.sections[0].sectionIngredients}
          quantity={quantity}
          baseQuantity={baseQuantity}
        />
      )}
    </Fragment>
  ))
