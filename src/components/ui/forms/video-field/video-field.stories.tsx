import { StorySection } from '@storybook-helpers/story-section'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactElement } from 'react'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'

import type { FileMetadata } from '@/hooks/use-file-upload'

import { FormErrorsContext } from '../form/form'
import { VideoField } from './video-field'

import * as styles from './video-field.stories.css'

const video: FileMetadata = { id: 'recipe-video', name: 'tomato-soup.mp4', size: 1_572_864, type: 'video/mp4', url: 'data:video/mp4;base64,' }

const VideoFieldExample = ({ disabled = false, initialVideo }: { disabled?: boolean; initialVideo?: FileMetadata }): ReactElement => {
  const [value, setValue] = useState<File | FileMetadata | undefined>(initialVideo)
  return (
    <FormErrorsContext value={{}}>
      <VideoField name="video" value={value} onChange={setValue} disabled={disabled} initialVideo={initialVideo} label="Recipe video" />
    </FormErrorsContext>
  )
}

const meta = { component: VideoFieldExample, title: 'Forms/VideoField' } satisfies Meta<typeof VideoFieldExample>
export default meta
type Story = StoryObj<typeof meta>
export const Overview: Story = {
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

export const Interaction: Story = {
  ...Overview,
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
  tags: ['!dev'],
}
