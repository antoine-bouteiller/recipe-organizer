import { useLinkedRecipes } from '@client/features/recipe/contexts/linked-recipes-context'
import { useRecipeOptions } from '@client/features/recipe/hooks/use-recipe-options'
import { recipeDefaultValues } from '@client/features/recipe/utils/form'
import { Button } from '@recipe-organizer/design-system/button'
import { withForm } from '@recipe-organizer/design-system/hooks/use-app-form'
import { CaretDownIcon } from '@recipe-organizer/design-system/icons/caret-down'
import { CaretUpIcon } from '@recipe-organizer/design-system/icons/caret-up'
import { PlusIcon } from '@recipe-organizer/design-system/icons/plus'
import { TextBolderIcon } from '@recipe-organizer/design-system/icons/text-bolder'
import { TrashIcon } from '@recipe-organizer/design-system/icons/trash'
import { Label } from '@recipe-organizer/design-system/label'
import { useRef } from 'react'
import type { KeyboardEvent } from 'react'

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

interface StepsFieldProps {
  disabled: boolean
}

const stepsFieldProps: StepsFieldProps = { disabled: false }

const groupStepsProps: StepsFieldProps & { groupIndex: number } = { disabled: false, groupIndex: 0 }

const GroupSteps = withForm({
  defaultValues: recipeDefaultValues,
  props: groupStepsProps,
  render: ({ disabled, form, groupIndex }) => {
    const { AppField } = form
    const textareaRefs = useRef(new Map<string, HTMLTextAreaElement | null>())

    return (
      <AppField mode="array" name={`stepGroups[${groupIndex}].steps`}>
        {(field) => {
          const steps = field.state.value ?? []
          return (
            <>
              <ol className={styles.list}>
                {steps.map((step, index) => (
                  <li className={styles.step} key={step._key}>
                    <span className={styles.number}>{index + 1}.</span>
                    <div className={styles.editor}>
                      <AppField name={`stepGroups[${groupIndex}].steps[${index}].text`}>
                        {(textField) => {
                          const applyBold = () => {
                            const element = textareaRefs.current.get(step._key)
                            if (!element) {
                              return
                            }
                            const next = toggleBold({ end: element.selectionEnd, start: element.selectionStart, value: element.value })
                            textField.handleChange(next.value)
                            requestAnimationFrame(() => {
                              element.focus()
                              element.setSelectionRange(next.start, next.end)
                            })
                          }
                          return (
                            <div className={styles.textStep}>
                              <textField.TextareaField
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
                          )
                        }}
                      </AppField>
                      <AppField name={`stepGroups[${groupIndex}].steps[${index}].magimix`}>
                        {(magimixField) => {
                          const magimix = magimixField.state.value
                          return magimix ? (
                            <div className={styles.magimixStep}>
                              <MagimixStepDialog
                                initialData={magimix}
                                onSubmit={magimixField.handleChange}
                                submitLabel="Enregistrer"
                                title="Modifier le programme Magimix"
                                triggerRender={
                                  <button className={styles.magimixTrigger} disabled={disabled} type="button">
                                    <MagimixStepItem {...magimix} />
                                  </button>
                                }
                              />
                              <Button
                                aria-label="Retirer le programme Magimix"
                                disabled={disabled}
                                onClick={() => magimixField.handleChange(undefined)}
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
                                onSubmit={magimixField.handleChange}
                                submitLabel="Ajouter"
                                title="Ajouter un programme Magimix"
                                triggerRender={
                                  <Button disabled={disabled} size="sm" type="button" variant="ghost">
                                    Magimix <PlusIcon size="sm" />
                                  </Button>
                                }
                              />
                            </div>
                          )
                        }}
                      </AppField>
                    </div>
                    <div className={styles.controls}>
                      <Button
                        aria-label="Monter l'étape"
                        disabled={disabled || index === 0}
                        onClick={() => field.moveValue(index, index - 1)}
                        size="icon-sm"
                        type="button"
                        variant="ghost"
                      >
                        <CaretUpIcon size="sm" />
                      </Button>
                      <Button
                        aria-label="Descendre l'étape"
                        disabled={disabled || index === steps.length - 1}
                        onClick={() => field.moveValue(index, index + 1)}
                        size="icon-sm"
                        type="button"
                        variant="ghost"
                      >
                        <CaretDownIcon size="sm" />
                      </Button>
                      <Button
                        aria-label="Supprimer l'étape"
                        disabled={disabled}
                        onClick={() => field.removeValue(index)}
                        size="icon-sm"
                        type="button"
                        variant="destructive-ghost"
                      >
                        <TrashIcon size="sm" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ol>
              <div className={styles.addActions}>
                <Button disabled={disabled} onClick={() => field.pushValue({ _key: newKey(), text: '' })} size="sm" type="button" variant="outline">
                  Étape <PlusIcon size="sm" />
                </Button>
              </div>
            </>
          )
        }}
      </AppField>
    )
  },
})

export const StepsField = withForm({
  defaultValues: recipeDefaultValues,
  props: stepsFieldProps,
  render: ({ disabled, form }) => {
    const { AppField } = form
    const linkedRecipeIds = useLinkedRecipes()
    const subrecipeOptions = useRecipeOptions({ filter: (recipe) => linkedRecipeIds.includes(recipe.id) })

    return (
      <div className={styles.container}>
        <Label>Étapes</Label>
        <AppField mode="array" name="stepGroups">
          {(field) => {
            const groups = field.state.value ?? []
            return (
              <>
                {groups.map((group, groupIndex) => (
                  <div className={styles.group} key={group._key}>
                    {/* The first group is the default one: unnamed, fixed, and always present. */}
                    {groupIndex > 0 && (
                      <div className={styles.groupHeader}>
                        <div className={styles.editor}>
                          {group.kind === 'steps' ? (
                            <AppField name={`stepGroups[${groupIndex}].groupName`}>
                              {({ TextField }) => <TextField disabled={disabled} label="Nom du groupe" />}
                            </AppField>
                          ) : (
                            <AppField name={`stepGroups[${groupIndex}].recipeId`}>
                              {({ ComboboxField }) => (
                                <ComboboxField
                                  disabled={disabled}
                                  options={subrecipeOptions}
                                  placeholder="Sélectionner une sous-recette liée"
                                  searchPlaceholder="Rechercher une sous-recette"
                                />
                              )}
                            </AppField>
                          )}
                        </div>
                        <div className={styles.controls}>
                          <Button
                            aria-label="Monter le groupe"
                            disabled={disabled || groupIndex === 1}
                            onClick={() => field.moveValue(groupIndex, groupIndex - 1)}
                            size="icon-sm"
                            type="button"
                            variant="ghost"
                          >
                            <CaretUpIcon size="sm" />
                          </Button>
                          <Button
                            aria-label="Descendre le groupe"
                            disabled={disabled || groupIndex === groups.length - 1}
                            onClick={() => field.moveValue(groupIndex, groupIndex + 1)}
                            size="icon-sm"
                            type="button"
                            variant="ghost"
                          >
                            <CaretDownIcon size="sm" />
                          </Button>
                          <Button
                            aria-label="Supprimer le groupe"
                            disabled={disabled}
                            onClick={() => field.removeValue(groupIndex)}
                            size="icon-sm"
                            type="button"
                            variant="destructive-ghost"
                          >
                            <TrashIcon size="sm" />
                          </Button>
                        </div>
                      </div>
                    )}
                    {group.kind === 'steps' && <GroupSteps disabled={disabled} form={form} groupIndex={groupIndex} />}
                  </div>
                ))}
                <div className={styles.addActions}>
                  <Button
                    disabled={disabled}
                    onClick={() => field.pushValue({ _key: newKey(), kind: 'steps', steps: [] })}
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    Groupe <PlusIcon size="sm" />
                  </Button>
                  <Button
                    disabled={disabled}
                    onClick={() => field.pushValue({ _key: newKey(), kind: 'subrecipe', recipeId: linkedRecipeIds[0] ?? -1 })}
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    Sous-recette <PlusIcon size="sm" />
                  </Button>
                </div>
              </>
            )
          }}
        </AppField>
      </div>
    )
  },
})
