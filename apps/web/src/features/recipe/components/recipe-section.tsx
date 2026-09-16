import { type Recipe, type RecipeIngredientGroup } from '@client/features/recipe/api/get-one'
import { useRecipeQuantities } from '@client/features/recipe/hooks/use-recipe-quantities'
import { formatNumber } from '@client/utils/number'
import { css } from '@recipe-organizer/design-system/css'
import { UNITS } from '@recipe-organizer/shared/units'
import { scaleQuantity } from '@recipe-organizer/shared/utils/scale-quantity'

interface RecipeGroupIngredientsProps {
  baseServings: number
  groupIngredients: RecipeIngredientGroup['groupIngredients']
  servings: number
  presentation: 'standalone' | 'embedded'
}

const RecipeGroupIngredients = ({ baseServings, groupIngredients, presentation, servings }: RecipeGroupIngredientsProps) =>
  groupIngredients.length > 0 && (
    <ul
      className={css({
        background: presentation === 'standalone' ? 'card' : undefined,
        borderRadius: presentation === 'standalone' ? '2xl' : undefined,
        borderWidth: presentation === 'standalone' ? '1px' : undefined,
        listStyle: 'none',
        margin: '0',
        overflow: presentation === 'standalone' ? 'hidden' : undefined,
        paddingInline: presentation === 'standalone' ? '3.5' : undefined,
      })}
    >
      {groupIngredients.map((groupIngredient) => (
        <li
          className={css({
            _last: { borderBottomWidth: '0' },
            borderBottomWidth: '1px',
            fontSize: 'sm',
            lineHeight: '1.5rem',
            margin: '0',
            paddingBlock: '3',
          })}
          key={groupIngredient.id}
        >
          <div
            className={css({ alignItems: 'center', display: 'flex', gap: '3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' })}
          >
            <span className={css({ background: 'primary', borderRadius: 'full', flexShrink: '0', height: '1.5', width: '1.5' })} />
            <div className={css({ flex: '1' })}>{groupIngredient.ingredient.name}</div>
            <div className={css({ color: 'muted-foreground', fontVariantNumeric: 'tabular-nums', fontWeight: 'semibold' })}>
              {formatNumber(scaleQuantity(groupIngredient.quantity, servings, baseServings))}
              {groupIngredient.unitSlug && ` ${UNITS[groupIngredient.unitSlug]?.name ?? ''}`}
            </div>
          </div>
        </li>
      ))}
    </ul>
  )

export interface RecipeIngredientGroupsProps {
  readonly recipeId: number
  readonly baseServings: number
  readonly ingredientGroups: Recipe['ingredientGroups']
  readonly presentation?: 'standalone' | 'embedded'
}

export const RecipeIngredientGroups = ({ recipeId, baseServings, ingredientGroups, presentation = 'standalone' }: RecipeIngredientGroupsProps) => {
  const { quantity } = useRecipeQuantities(recipeId, baseServings)

  return ingredientGroups.map((group) => (
    <div className={css({ _last: { marginBottom: '0' }, marginBottom: '4' })} key={group.id}>
      {group.groupName && <div className={css({ fontWeight: 'semibold', marginBottom: '2', paddingInline: '1' })}>{group.groupName}</div>}

      <RecipeGroupIngredients baseServings={baseServings} groupIngredients={group.groupIngredients} presentation={presentation} servings={quantity} />
    </div>
  ))
}
