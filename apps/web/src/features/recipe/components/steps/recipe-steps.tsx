import { getRecipeInstructionsOptions } from '@client/features/recipe/api/get-instructions'
import { Spinner } from '@recipe-organizer/design-system/spinner'
import { parseBoldText } from '@recipe-organizer/shared/recipe/bold-text'
import type { RecipeStep, RecipeStepGroup } from '@recipe-organizer/shared/recipe/schemas'
import { useQuery } from '@tanstack/react-query'

import { MagimixStepItem } from './magimix-step-item'

import * as styles from './recipe-steps.css'

const StepList = ({ steps }: { readonly steps: readonly RecipeStep[] }) =>
  steps.length > 0 && (
    <ol className={styles.list}>
      {steps.map((step, index) => (
        // Steps have no persisted identity; position is their identity in a read-only list.
        // oxlint-disable-next-line react/no-array-index-key
        <li className={styles.step} key={index}>
          <p className={styles.text}>
            {parseBoldText(step.text).map((segment, segmentIndex) =>
              // oxlint-disable-next-line react/no-array-index-key
              segment.bold ? <strong key={segmentIndex}>{segment.text}</strong> : segment.text
            )}
          </p>
          {step.magimix && (
            <div className={styles.magimix}>
              <MagimixStepItem {...step.magimix} />
            </div>
          )}
        </li>
      ))}
    </ol>
  )

// Shows the linked recipe's default group, which never embeds another recipe.
const SubrecipeGroup = ({ recipeId }: { readonly recipeId: number }) => {
  const { data: source, isLoading } = useQuery(getRecipeInstructionsOptions(recipeId))
  if (isLoading) {
    return <Spinner />
  }
  if (!source) {
    return null
  }
  return (
    <div>
      <strong className={styles.groupName}>{source.name}</strong>
      <StepList steps={source.steps} />
    </div>
  )
}

export const RecipeStepGroups = ({ stepGroups }: { readonly stepGroups: readonly RecipeStepGroup[] }) => (
  <div className={styles.groups}>
    {stepGroups.map((group, index) =>
      group.kind === 'steps' ? (
        // Groups have no persisted identity; position is their identity in a read-only list.
        // oxlint-disable-next-line react/no-array-index-key
        <div key={index}>
          {group.groupName && <strong className={styles.groupName}>{group.groupName}</strong>}
          <StepList steps={group.steps} />
        </div>
      ) : (
        // oxlint-disable-next-line react/no-array-index-key
        <SubrecipeGroup key={index} recipeId={group.recipeId} />
      )
    )}
  </div>
)
