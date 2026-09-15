import { type Meta, type StoryObj } from '@storybook/react-vite'
import { type ReactElement } from 'react'

import { StorySection } from '../../../../.storybook/story-section'
import { useAppForm } from '../../../hooks/use-app-form'
import { type FileMetadata } from '../../../hooks/use-file-upload'

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

const meta = { component: VideoFieldExample, tags: ['autodocs'], title: 'Forms/VideoField' } satisfies Meta<typeof VideoFieldExample>
export default meta
type Story = StoryObj<typeof meta>
export const Overview: Story = {
  render: () => (
    <div className="flex w-full min-w-0 flex-col gap-8">
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
