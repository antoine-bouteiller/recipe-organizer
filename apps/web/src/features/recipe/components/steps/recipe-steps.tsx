import { getRecipeInstructionsOptions } from '@client/features/recipe/api/get-instructions'
import { Spinner } from '@recipe-organizer/design-system/spinner'
import { parseBoldText } from '@recipe-organizer/shared/recipe/bold-text'
import { type RecipeStep } from '@recipe-organizer/shared/recipe/schemas'
import { useQuery } from '@tanstack/react-query'

import { MagimixStepItem } from './magimix-step-item'
import { clampStepRange } from './step-utils'

import * as styles from './recipe-steps.css'

interface RecipeStepsProps {
  // Numbers shown for each step; a sub-recipe slice keeps its source's numbers.
  firstNumber?: number
  steps: readonly RecipeStep[]
  // Recipes already on the render path, so a link cycle stops at a title.
  visited: readonly number[]
}

const SubrecipeSection = ({ step, visited }: { readonly step: Extract<RecipeStep, { kind: 'subrecipe' }>; readonly visited: readonly number[] }) => {
  const { data: source, isLoading } = useQuery(getRecipeInstructionsOptions(step.recipeId))
  if (isLoading) {
    return <Spinner />
  }
  if (!source) {
    return null
  }
  const { first, last } = clampStepRange(source.steps.length, step.fromStep, step.toStep)
  return (
    <>
      <strong className={styles.subrecipeTitle}>{source.name}</strong>
      {!visited.includes(source.id) && first <= last && (
        <RecipeSteps firstNumber={first} steps={source.steps.slice(first - 1, last)} visited={[...visited, source.id]} />
      )}
    </>
  )
}

export const RecipeSteps = ({ firstNumber = 1, steps, visited }: RecipeStepsProps) => (
  <ol className={styles.list}>
    {steps.map((step, index) => (
      // Steps have no persisted identity; position is their identity in a read-only list.
      // oxlint-disable-next-line react/no-array-index-key
      <li className={styles.step} key={index} value={firstNumber + index}>
        {step.kind === 'text' && (
          <p className={styles.text}>
            {parseBoldText(step.text).map((segment, segmentIndex) =>
              // oxlint-disable-next-line react/no-array-index-key
              segment.bold ? <strong key={segmentIndex}>{segment.text}</strong> : segment.text
            )}
          </p>
        )}
        {step.kind === 'magimix' && <MagimixStepItem {...step} />}
        {step.kind === 'subrecipe' && <SubrecipeSection step={step} visited={visited} />}
      </li>
    ))}
  </ol>
)
