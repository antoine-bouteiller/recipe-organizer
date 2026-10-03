import { StorySection } from '@storybook-helpers/story-section'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactElement } from 'react'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'

import { FormErrorsContext } from '../form/form'
import { TextareaField } from './textarea-field'

import * as styles from './textarea-field.stories.css'

const TextareaFieldExample = ({ disabled = false, initialValue = '' }: { disabled?: boolean; initialValue?: string }): ReactElement => {
  const [value, setValue] = useState<string>(initialValue)
  return (
    <FormErrorsContext value={{}}>
      <TextareaField name="step" value={value} onChange={setValue} disabled={disabled} label="Étape" placeholder="Décrivez l’étape" />
    </FormErrorsContext>
  )
}

const meta = { component: TextareaFieldExample, title: 'Forms/TextareaField' } satisfies Meta<typeof TextareaFieldExample>
export default meta
type Story = StoryObj<typeof meta>
export const Overview: Story = {
  render: () => (
    <div className={styles.container}>
      <StorySection title="Default">
        <TextareaFieldExample />
      </StorySection>
      <StorySection title="Initial Value">
        <TextareaFieldExample initialValue={'Mélanger **vivement**.\nLaisser reposer 10 minutes.'} />
      </StorySection>
      <StorySection title="Disabled">
        <TextareaFieldExample disabled initialValue="Servir chaud." />
      </StorySection>
    </div>
  ),
}

export const Interaction: Story = {
  ...Overview,
  play: async ({ canvasElement }) => {
    const section = within(canvasElement).getByRole('region', { name: 'Default' })
    const textarea = within(section).getByRole('textbox', { name: 'Étape' })
    await userEvent.type(textarea, 'Ligne 1{enter}Ligne 2')
    await expect(textarea).toHaveValue('Ligne 1\nLigne 2')
  },
  tags: ['!dev'],
}
