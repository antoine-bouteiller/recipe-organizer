import type { Recipe, RecipeSection } from '@/features/recipe/api/get-one'
import { Fragment } from 'react/jsx-runtime'

interface RecipeSectionIngredientsProps {
  sectionIngredients: RecipeSection['sectionIngredients']
}

const RecipeSectionIngredients = ({ sectionIngredients }: RecipeSectionIngredientsProps) =>
  sectionIngredients.length > 0 && (
    <ul className="list-disc list-outside space-y-2 pl-4">
      {sectionIngredients.map((sectionIngredient) => (
        <li key={sectionIngredient.id}>
          <div className="flex items-center justify-between gap-2 text-nowrap text-ellipsis">
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

interface RecipeSectionsProps {
  sections: Recipe['sections']
}

export const RecipeSections = ({ sections }: RecipeSectionsProps) =>
  sections.map((section) => (
    <Fragment key={section.id}>
      {section.name && <h3 className="mb-1 text-md font-semibold">{section.name}</h3>}

      <RecipeSectionIngredients sectionIngredients={section.sectionIngredients} />
    </Fragment>
  ))
