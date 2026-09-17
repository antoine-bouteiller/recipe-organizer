import { type Meta, type StoryObj } from '@storybook/react-vite'
import { type ReactElement } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { StorySection } from '../../../../.storybook/story-section'
import { useAppForm } from '../../../hooks/use-app-form'
import { type FileMetadata } from '../../../hooks/use-file-upload'

import * as styles from './image-field.stories.css'

const image: FileMetadata = {
  id: 'recipe-image',
  name: 'recipe.svg',
  size: 320,
  type: 'image/svg+xml',
  url: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="640" height="360"%3E%3Crect width="100%25" height="100%25" fill="%23f97316"/%3E%3Ctext x="50%25" y="50%25" fill="white" font-size="42" text-anchor="middle" dominant-baseline="middle"%3ERecipe%3C/text%3E%3C/svg%3E',
}

const ImageFieldExample = ({ disabled = false, initialImage }: { disabled?: boolean; initialImage?: FileMetadata }): ReactElement => {
  const form = useAppForm({ defaultValues: { image: initialImage }, onSubmit: async () => undefined })

  return (
    <form.AppForm>
      <form.AppField name="image">
        {({ ImageField: AppImageField }) => <AppImageField disabled={disabled} initialImage={initialImage} label="Recipe image" />}
      </form.AppField>
    </form.AppForm>
  )
}

const meta = { component: ImageFieldExample, title: 'Forms/ImageField' } satisfies Meta<typeof ImageFieldExample>
export default meta
type Story = StoryObj<typeof meta>
export const Overview: Story = {
  play: async ({ canvasElement }) => {
    const section = within(canvasElement).getByRole('region', { name: 'Initial Image' })
    await waitFor(() => expect(section.querySelector('img')?.naturalWidth).toBeGreaterThan(0))

    const empty = within(within(canvasElement).getByRole('region', { name: 'Empty' }))
    const file = new File(['<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>'], 'image.svg', { type: 'image/svg+xml' })
    await userEvent.upload(empty.getByLabelText('Recipe image'), file)
    await waitFor(() => expect(empty.getByAltText('Aperçu')).toHaveAttribute('src', expect.stringMatching(/^blob:/)))
    await userEvent.click(empty.getByRole('button', { name: "Supprimer l'image" }))
    await expect(empty.queryByAltText('Aperçu')).not.toBeInTheDocument()
  },
  render: () => (
    <div className={styles.container}>
      <StorySection title="Empty">
        <ImageFieldExample />
      </StorySection>
      <StorySection title="Initial Image">
        <ImageFieldExample initialImage={image} />
      </StorySection>
      <StorySection title="Disabled">
        <ImageFieldExample disabled initialImage={image} />
      </StorySection>
    </div>
  ),
}
