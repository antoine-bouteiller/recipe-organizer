<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, userEvent, within } from 'storybook/test'

  import Example from './steps-field.example.svelte'

  const { Story } = defineMeta({ component: Example, title: 'Recipe/StepsField' })
  // Editor VC-1/VC-4, migration VC-3: keyed rows preserve text/program identity
  // Through reorder; bold restores the selection so the same shortcut unwraps it.
  const play = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /^Étape$/ }))
    const first = canvas.getByRole('textbox', { name: "Texte de l'étape 1" }) as HTMLTextAreaElement
    await userEvent.type(first, 'Mélanger')
    first.setSelectionRange(0, 8)
    await userEvent.click(canvas.getByRole('button', { name: 'Gras' }))
    await expect(first).toHaveValue('**Mélanger**')
    await expect(first).toHaveFocus()
    await userEvent.keyboard('{Control>}b{/Control}')
    await expect(first).toHaveValue('Mélanger')
    await userEvent.click(canvas.getByRole('button', { name: /^Étape$/ }))
    await userEvent.type(canvas.getByRole('textbox', { name: "Texte de l'étape 2" }), 'Cuire')
    await userEvent.click(canvas.getAllByRole('button', { name: /^Magimix$/ }).at(1) as HTMLElement)
    const dialog = within(document.body).getByRole('dialog', { name: 'Ajouter un programme Magimix' })
    await userEvent.type(within(dialog).getByRole('textbox', { name: 'Minutes*' }), '2')
    await userEvent.type(within(dialog).getByRole('textbox', { name: 'Secondes*' }), '5')
    await userEvent.type(within(dialog).getByRole('textbox', { name: 'Température (°C) - Optionnel' }), '100')
    await userEvent.click(within(dialog).getByRole('button', { name: /^Ajouter$/ }))
    await userEvent.click(canvas.getAllByRole('button', { name: "Monter l'étape" }).at(1) as HTMLElement)
    await expect(canvas.getByRole('textbox', { name: "Texte de l'étape 1" })).toHaveValue('Cuire')
    await userEvent.click(canvas.getAllByRole('button', { name: "Supprimer l'étape" }).at(1) as HTMLElement)
    await userEvent.click(canvas.getByRole('button', { name: /^Groupe$/ }))
    await userEvent.type(canvas.getByRole('textbox', { name: 'Nom du groupe' }), 'Finition')
    await userEvent.click(canvas.getByRole('button', { name: /^Sous-recette$/ }))
    await userEvent.click(canvas.getAllByRole('button', { name: 'Monter le groupe' }).at(1) as HTMLElement)
    const groups = JSON.parse(canvas.getByLabelText('Étapes enregistrées').textContent ?? '[]')
    await expect(groups.map((group: { kind: string }) => group.kind)).toEqual(['steps', 'subrecipe', 'steps'])
    await expect(groups[0].steps.map((step: { text: string }) => step.text)).toEqual(['Cuire'])
    await expect(groups[0].steps[0].magimix).toEqual({ program: 'expert', rotationSpeed: 'auto', temperature: 100, time: 125 })
    await expect(groups[1].recipeId).toBe(11)
    await expect(groups[2].groupName).toBe('Finition')
    // CT-3/4: already-mounted picker observes both catalogue and linked-id refreshes.
    await userEvent.click(canvas.getByRole('button', { name: 'Rafraîchir le catalogue' }))
    await expect(canvas.getByRole('button', { name: 'Sauce rafraîchie' })).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Retirer le lien' }))
    await expect(canvas.getByRole('button', { name: 'Sélectionner une sous-recette liée' })).toBeVisible()
    await expect(canvas.getByText('Choisissez une sous-recette liée')).toBeVisible()
  }
</script>

<Story name="Structured steps and live links (VC-3)" {play} />
