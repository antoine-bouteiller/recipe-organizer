import { parseBoldText } from '@recipe-organizer/shared/recipe/bold-text'
import type { RecipeStep, RecipeStepGroup } from '@recipe-organizer/shared/recipe/schemas'

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

export interface SubrecipeInstructions {
  readonly id: number
  readonly name: string
  readonly steps: readonly RecipeStep[]
}

// Shows the linked recipe's default group, which never embeds another recipe.
const SubrecipeGroup = ({ source }: { readonly source: SubrecipeInstructions | undefined }) => {
  if (!source || source.steps.length === 0) {
    return null
  }
  return (
    <div>
      <strong className={styles.groupName}>{source.name}</strong>
      <StepList steps={source.steps} />
    </div>
  )
}

export const RecipeStepGroups = ({
  stepGroups,
  subrecipes,
}: {
  readonly stepGroups: readonly RecipeStepGroup[]
  readonly subrecipes: readonly SubrecipeInstructions[]
}) => (
  <div className={styles.groups}>
    {stepGroups.map((group, index) =>
      group.kind === 'steps' ? (
        group.steps.length > 0 && (
          // Groups have no persisted identity; position is their identity in a read-only list.
          // oxlint-disable-next-line react/no-array-index-key
          <div key={index}>
            {group.groupName && <strong className={styles.groupName}>{group.groupName}</strong>}
            <StepList steps={group.steps} />
          </div>
        )
      ) : (
        // oxlint-disable-next-line react/no-array-index-key
        <SubrecipeGroup key={index} source={subrecipes.find((source) => source.id === group.recipeId)} />
      )
    )}
  </div>
)
