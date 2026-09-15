import { type Meta, type StoryObj } from '@storybook/react-vite'
import { type ReactElement } from 'react'
import { expect, waitFor } from 'storybook/test'

import { useAppForm } from '../../../hooks/use-app-form'
import { type FileMetadata } from '../../../hooks/use-file-upload'

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

const meta = { component: ImageFieldExample, tags: ['autodocs'], title: 'Forms/ImageField' } satisfies Meta<typeof ImageFieldExample>
export default meta
type Story = StoryObj<typeof meta>
export const Empty: Story = { render: () => <ImageFieldExample /> }
export const InitialImage: Story = {
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(canvasElement.querySelector('img')?.naturalWidth).toBeGreaterThan(0))
  },
  render: () => <ImageFieldExample initialImage={image} />,
}
export const Disabled: Story = { render: () => <ImageFieldExample disabled initialImage={image} /> }
