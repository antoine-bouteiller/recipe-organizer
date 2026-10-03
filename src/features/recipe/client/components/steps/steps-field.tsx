import { useRef } from 'react'
import type { KeyboardEvent } from 'react'

import { Button } from '@/components/ui/actions/button/button'
import { CaretDownIcon, CaretUpIcon, PlusIcon, TextBolderIcon, TrashIcon } from '@/components/ui/data-display/icons'
import { ComboboxField } from '@/components/ui/forms/combobox-field/combobox-field'
import { Field, FieldError } from '@/components/ui/forms/field/field'
import { Label } from '@/components/ui/forms/label/label'
import { TextField } from '@/components/ui/forms/text-field/text-field'
import { TextareaField } from '@/components/ui/forms/textarea-field/textarea-field'
import type { RecipeFormState } from '@/features/recipe/client/components/recipe-form'
import { useLinkedRecipes } from '@/features/recipe/client/contexts/linked-recipes-context'
import { useRecipeOptions } from '@/features/recipe/client/hooks/use-recipe-options'
import type { RecipeFormInput } from '@/features/recipe/schemas'
import { moveAt, removeAt, replaceAt } from '@/utils/array'

import { MagimixStepDialog } from './magimix-step-dialog'
import { MagimixStepItem } from './magimix-step-item'
import { toggleBold } from './step-utils'

import * as styles from './steps-field.css'

const newKey = () => Math.random().toString(36).substring(7)
const handleBoldShortcut = (event: KeyboardEvent<HTMLTextAreaElement>, applyBold: () => void) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'b') {
    event.preventDefault()
    applyBold()
  }
}

type StepGroup = NonNullable<RecipeFormInput['stepGroups']>[number]
type OwnStepGroup = Extract<StepGroup, { kind: 'steps' }>

const GroupSteps = ({
  disabled,
  group,
  groupIndex,
  update,
}: {
  disabled: boolean
  group: OwnStepGroup
  groupIndex: number
  update: (group: OwnStepGroup) => void
}) => {
  const textareaRefs = useRef(new Map<string, HTMLTextAreaElement | null>())
  const { steps } = group
  return (
    <Field name={`stepGroups.${groupIndex}.steps`}>
      <ol className={styles.list}>
        {steps.map((step, index) => {
          const { magimix } = step
          const path = `stepGroups.${groupIndex}.steps.${index}`
          const updateStep = (value: typeof step) => update({ ...group, steps: replaceAt(steps, index, value) })
          const applyBold = () => {
            const element = textareaRefs.current.get(step._key)
            if (!element) {
              return
            }
            const next = toggleBold({ end: element.selectionEnd, start: element.selectionStart, value: element.value })
            updateStep({ ...step, text: next.value })
            requestAnimationFrame(() => {
              element.focus()
              element.setSelectionRange(next.start, next.end)
            })
          }
          return (
            <li className={styles.step} key={step._key}>
              <span className={styles.number}>{index + 1}.</span>
              <div className={styles.editor}>
                <div className={styles.textStep}>
                  <TextareaField
                    name={`${path}.text`}
                    value={step.text}
                    onChange={(value) => updateStep({ ...step, text: value })}
                    aria-label={`Texte de l'étape ${index + 1}`}
                    disabled={disabled}
                    onKeyDown={(event) => handleBoldShortcut(event, applyBold)}
                    placeholder="Décrivez l'étape"
                    ref={(element) => {
                      textareaRefs.current.set(step._key, element)
                      return () => {
                        textareaRefs.current.delete(step._key)
                      }
                    }}
                  />
                  <Button aria-label="Gras" disabled={disabled} onClick={applyBold} size="icon-sm" type="button" variant="ghost">
                    <TextBolderIcon size="sm" />
                  </Button>
                </div>
                <Field name={`${path}.magimix`}>
                  {magimix ? (
                    <div className={styles.magimixStep}>
                      <MagimixStepDialog
                        initialData={magimix}
                        onSubmit={(value) => updateStep({ ...step, magimix: value })}
                        submitLabel="Enregistrer"
                        title="Modifier le programme Magimix"
                        renderTrigger={(props) => (
                          <button {...props} className={styles.magimixTrigger} disabled={disabled} type="button">
                            <MagimixStepItem {...magimix} />
                          </button>
                        )}
                      />
                      <Button
                        aria-label="Retirer le programme Magimix"
                        disabled={disabled}
                        onClick={() => updateStep({ ...step, magimix: undefined })}
                        size="icon-sm"
                        type="button"
                        variant="destructive-ghost"
                      >
                        <TrashIcon size="sm" />
                      </Button>
                    </div>
                  ) : (
                    <div className={styles.addMagimix}>
                      <MagimixStepDialog
                        onSubmit={(value) => updateStep({ ...step, magimix: value })}
                        submitLabel="Ajouter"
                        title="Ajouter un programme Magimix"
                        renderTrigger={(props) => (
                          <Button {...props} disabled={disabled} size="sm" type="button" variant="ghost">
                            Magimix <PlusIcon size="sm" />
                          </Button>
                        )}
                      />
                    </div>
                  )}
                  <FieldError />
                </Field>
              </div>
              <div className={styles.controls}>
                <Button
                  aria-label="Monter l'étape"
                  disabled={disabled || index === 0}
                  onClick={() => update({ ...group, steps: moveAt(steps, index, index - 1) })}
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                >
                  <CaretUpIcon size="sm" />
                </Button>
                <Button
                  aria-label="Descendre l'étape"
                  disabled={disabled || index === steps.length - 1}
                  onClick={() => update({ ...group, steps: moveAt(steps, index, index + 1) })}
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                >
                  <CaretDownIcon size="sm" />
                </Button>
                <Button
                  aria-label="Supprimer l'étape"
                  disabled={disabled}
                  onClick={() => update({ ...group, steps: removeAt(steps, index) })}
                  size="icon-sm"
                  type="button"
                  variant="destructive-ghost"
                >
                  <TrashIcon size="sm" />
                </Button>
              </div>
            </li>
          )
        })}
      </ol>
      <FieldError />
      <div className={styles.addActions}>
        <Button
          disabled={disabled}
          onClick={() => update({ ...group, steps: [...steps, { _key: newKey(), text: '' }] })}
          size="sm"
          type="button"
          variant="outline"
        >
          Étape <PlusIcon size="sm" />
        </Button>
      </div>
    </Field>
  )
}

export const StepsField = ({ disabled, form }: { disabled: boolean; form: RecipeFormState }) => {
  const linkedRecipeIds = useLinkedRecipes()
  const subrecipeOptions = useRecipeOptions({ filter: (recipe) => linkedRecipeIds.includes(recipe.id) })
  const groups = form.data.stepGroups ?? []
  const setGroups = (value: typeof groups) => form.setData('stepGroups', value)
  return (
    <div className={styles.container}>
      <Label>Étapes</Label>
      <Field name="stepGroups">
        {groups.map((group, groupIndex) => {
          const update = (value: StepGroup) => setGroups(replaceAt(groups, groupIndex, value))
          return (
            <div className={styles.group} key={group._key}>
              {groupIndex > 0 && (
                <div className={styles.groupHeader}>
                  <div className={styles.editor}>
                    {group.kind === 'steps' ? (
                      <TextField
                        name={`stepGroups.${groupIndex}.groupName`}
                        value={group.groupName ?? ''}
                        onChange={(value) => update({ ...group, groupName: value })}
                        disabled={disabled}
                        label="Nom du groupe"
                      />
                    ) : (
                      <ComboboxField
                        name={`stepGroups.${groupIndex}.recipeId`}
                        value={group.recipeId}
                        onChange={(value) => update({ ...group, recipeId: value ?? -1 })}
                        disabled={disabled}
                        options={subrecipeOptions}
                        placeholder="Sélectionner une sous-recette liée"
                        searchPlaceholder="Rechercher une sous-recette"
                      />
                    )}
                  </div>
                  <div className={styles.controls}>
                    <Button
                      aria-label="Monter le groupe"
                      disabled={disabled || groupIndex === 1}
                      onClick={() => setGroups(moveAt(groups, groupIndex, groupIndex - 1))}
                      size="icon-sm"
                      type="button"
                      variant="ghost"
                    >
                      <CaretUpIcon size="sm" />
                    </Button>
                    <Button
                      aria-label="Descendre le groupe"
                      disabled={disabled || groupIndex === groups.length - 1}
                      onClick={() => setGroups(moveAt(groups, groupIndex, groupIndex + 1))}
                      size="icon-sm"
                      type="button"
                      variant="ghost"
                    >
                      <CaretDownIcon size="sm" />
                    </Button>
                    <Button
                      aria-label="Supprimer le groupe"
                      disabled={disabled}
                      onClick={() => setGroups(removeAt(groups, groupIndex))}
                      size="icon-sm"
                      type="button"
                      variant="destructive-ghost"
                    >
                      <TrashIcon size="sm" />
                    </Button>
                  </div>
                </div>
              )}
              {group.kind === 'steps' && <GroupSteps disabled={disabled} group={group} groupIndex={groupIndex} update={update} />}
            </div>
          )
        })}
        <FieldError />
        <div className={styles.addActions}>
          <Button
            disabled={disabled}
            onClick={() => setGroups([...groups, { _key: newKey(), kind: 'steps', steps: [] }])}
            size="sm"
            type="button"
            variant="outline"
          >
            Groupe <PlusIcon size="sm" />
          </Button>
          <Button
            disabled={disabled}
            onClick={() => setGroups([...groups, { _key: newKey(), kind: 'subrecipe', recipeId: linkedRecipeIds[0] ?? -1 }])}
            size="sm"
            type="button"
            variant="outline"
          >
            Sous-recette <PlusIcon size="sm" />
          </Button>
        </div>
      </Field>
    </div>
  )
}
