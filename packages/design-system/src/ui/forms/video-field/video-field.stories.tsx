import { type Meta, type StoryObj } from '@storybook/react-vite'
import { type ReactElement } from 'react'
import { expect, userEvent, within } from 'storybook/test'

import { StorySection } from '../../../../.storybook/story-section'
import { useAppForm } from '../../../hooks/use-app-form'
import { type FileMetadata } from '../../../hooks/use-file-upload'

import * as styles from './video-field.stories.css'

const video: FileMetadata = { id: 'recipe-video', name: 'tomato-soup.mp4', size: 1_572_864, type: 'video/mp4', url: 'data:video/mp4;base64,' }

const VideoFieldExample = ({ disabled = false, initialVideo }: { disabled?: boolean; initialVideo?: FileMetadata }): ReactElement => {
  const form = useAppForm({ defaultValues: { video: initialVideo }, onSubmit: async () => undefined })

  return (
    <form.AppForm>
      <form.AppField name="video">
        {({ VideoField: AppVideoField }) => <AppVideoField disabled={disabled} initialVideo={initialVideo} label="Recipe video" />}
      </form.AppField>
    </form.AppForm>
  )
}

const meta = { component: VideoFieldExample, title: 'Forms/VideoField' } satisfies Meta<typeof VideoFieldExample>
export default meta
type Story = StoryObj<typeof meta>
export const Overview: Story = {
  play: async ({ canvasElement }) => {
    const empty = within(within(canvasElement).getByRole('region', { name: 'Empty' }))
    const input = empty.getByLabelText('Recipe video')
    await userEvent.upload(input, new File(['video'], 'recipe.mp4', { type: 'video/mp4' }))
    await expect(empty.getByText('recipe.mp4')).toBeVisible()
    await userEvent.click(empty.getByRole('button', { name: 'Remove video' }))
    await expect(empty.queryByText('recipe.mp4')).not.toBeInTheDocument()

    const oversized = new File(['video'], 'oversized.mp4', { type: 'video/mp4' })
    Object.defineProperty(oversized, 'size', { value: 100 * 1024 * 1024 + 1 })
    await userEvent.upload(input, oversized)
    await expect(empty.queryByText('oversized.mp4')).not.toBeInTheDocument()
  },
  render: () => (
    <div className={styles.container}>
      <StorySection title="Empty">
        <VideoFieldExample />
      </StorySection>
      <StorySection title="Initial Video">
        <VideoFieldExample initialVideo={video} />
      </StorySection>
      <StorySection title="Disabled">
        <VideoFieldExample disabled initialVideo={video} />
      </StorySection>
    </div>
  ),
}
