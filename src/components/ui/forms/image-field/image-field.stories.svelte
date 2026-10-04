<script module lang="ts">
  import StorySection from '@storybook-helpers/story-section.svelte'
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, spyOn, userEvent, waitFor, within } from 'storybook/test'
  import { tick } from 'svelte'

  import VideoExample from '@/components/ui/forms/video-field/video-field.example.svelte'
  import type { FileMetadata } from '@/hooks/use-file-upload.svelte'

  import UploadExample from './file-upload.lifecycle.example.svelte'
  import Example from './image-field.example.svelte'

  const paste = (files: File[] = [], text = '') => {
    const clipboardData = new DataTransfer()
    for (const file of files) {
      clipboardData.items.add(file)
    }
    clipboardData.setData('text', text)
    document.dispatchEvent(new ClipboardEvent('paste', { clipboardData }))
  }
  const image: FileMetadata = {
    id: 'recipe-image',
    name: 'recipe.svg',
    size: 320,
    type: 'image/svg+xml',
    url: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="640" height="360"%3E%3Crect width="100%25" height="100%25" fill="%23f97316"/%3E%3Ctext x="50%25" y="50%25" fill="white" font-size="42" text-anchor="middle" dominant-baseline="middle"%3ERecipe%3C/text%3E%3C/svg%3E',
  }
  const video: FileMetadata = { id: 'recipe-video', name: 'existing.mp4', type: 'video/mp4', url: 'data:video/mp4;base64,' }
  const { Story } = defineMeta({ component: Example, title: 'Forms/ImageField' })
  const play = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const section = within(canvasElement).getByRole('region', { name: 'Initial Image' })
    await waitFor(() => expect(section.querySelector('img')?.naturalWidth).toBeGreaterThan(0))

    const empty = within(within(canvasElement).getByRole('region', { name: 'Empty' }))
    const file = new File(['<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>'], 'image.svg', { type: 'image/svg+xml' })
    await userEvent.upload(empty.getByLabelText('Recipe image'), file)
    await waitFor(() => expect(empty.getByAltText('Aperçu')).toHaveAttribute('src', expect.stringMatching(/^blob:/)))
    await userEvent.click(empty.getByRole('button', { name: "Supprimer l'image" }))
    await expect(empty.queryByAltText('Aperçu')).not.toBeInTheDocument()
    const disabled = within(within(canvasElement).getByRole('region', { name: 'Disabled' }))
    await expect(disabled.getByLabelText('Recipe image')).toBeDisabled()
    await expect(disabled.getByRole('button', { name: "Supprimer l'image" })).toBeDisabled()
    await userEvent.click(disabled.getByRole('button', { name: "Supprimer l'image" }))
    await expect(disabled.getByAltText('Aperçu')).toHaveAttribute('src', image.url)
  }
</script>

{#snippet overview()}
  <div class="container">
    <StorySection title="Empty">
      <Example />
    </StorySection>
    <StorySection title="Initial Image">
      <Example initialImage={image} />
    </StorySection>
    <StorySection title="Disabled">
      <Example disabled initialImage={image} />
    </StorySection>
  </div>
{/snippet}
<Story name="Overview" asChild>{@render overview()}</Story>
<Story name="Interaction" asChild {play} tags={['!dev']}>{@render overview()}</Story>

<Story
  name="Upload Validation And URL Lifecycle"
  asChild
  tags={['!dev']}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Upload file')
    const revoked = spyOn(URL, 'revokeObjectURL')
    const uploader = userEvent.setup({ applyAccept: false })
    try {
      await uploader.upload(input, new File(['video'], 'first.MP4', { type: 'video/mp4' }))
      await expect(canvas.getByRole('status')).toHaveTextContent('first.MP4')
      await uploader.upload(input, new File(['video'], 'second.mp4', { type: 'video/mp4' }))
      await expect(revoked).toHaveBeenCalledTimes(1)
      await userEvent.click(canvas.getByRole('button', { name: 'Remove upload' }))
      await expect(revoked).toHaveBeenCalledTimes(2)
      await expect(canvas.getByRole('status')).toHaveTextContent('No selection')
      await uploader.upload(input, new File(['text'], 'invalid.txt', { type: 'text/plain' }))
      await expect(canvas.getByRole('alert')).toHaveTextContent(`Le fichier "invalid.txt" n'est pas un type de fichier accepté.`)
      const large = new File(['video'], 'large.mp4', { type: 'video/mp4' })
      Object.defineProperty(large, 'size', { value: 1025 })
      await uploader.upload(input, large)
      await expect(canvas.getByRole('alert')).toHaveTextContent('Le fichier "large.mp4" dépasse la taille maximale de 1KB.')
      await uploader.upload(input, new File(['video'], 'last.mp4', { type: 'video/mp4' }))
      await expect(canvas.queryByRole('alert')).not.toBeInTheDocument()
      await userEvent.click(canvas.getByRole('button', { name: 'Destroy upload' }))
      await expect(revoked).toHaveBeenCalledTimes(3)
      paste([new File(['video'], 'after-destroy.mp4', { type: 'video/mp4' })])
      await expect(canvas.getByRole('status')).toHaveTextContent('last.mp4')
    } finally {
      revoked.mockRestore()
    }
  }}><UploadExample accept=".mp4,video/webm" maxSize={1024} /></Story
>

<Story
  name="Clipboard Files URLs And Editable Focus"
  asChild
  tags={['!dev']}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const fetched = spyOn(globalThis, 'fetch')
    try {
      const imageFile = new File(['image'], 'clipboard.png', { type: 'image/png' })
      await userEvent.click(canvas.getByRole('textbox', { name: 'Paste notes' }))
      paste([imageFile])
      await expect(canvas.getByRole('status')).toHaveTextContent('No selection')
      await userEvent.click(canvas.getByRole('textbox', { name: 'Editable notes' }))
      paste([imageFile])
      await expect(canvas.getByRole('status')).toHaveTextContent('No selection')
      await userEvent.click(canvas.getByRole('status'))
      paste([imageFile])
      await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('clipboard.png'))
      await userEvent.click(canvas.getByRole('button', { name: 'Remove upload' }))
      fetched.mockResolvedValueOnce(new Response('image', { headers: { 'content-type': 'image/png' } }))
      paste([], 'https://example.com/pasted.png')
      await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('pasted.png'))
      await expect(fetched).toHaveBeenCalledTimes(1)
      fetched.mockRejectedValueOnce(new Error('offline'))
      paste([], 'https://example.com/offline.png')
      await waitFor(() => expect(fetched).toHaveBeenCalledTimes(2))
      await expect(canvas.getByRole('status')).toHaveTextContent('pasted.png')
      fetched.mockResolvedValueOnce(new Response('not an image', { headers: { 'content-type': 'text/plain' } }))
      paste([], 'https://example.com/invalid.png')
      await waitFor(() => expect(fetched).toHaveBeenCalledTimes(3))
      await expect(canvas.getByRole('status')).toHaveTextContent('pasted.png')
    } finally {
      fetched.mockRestore()
    }
  }}><UploadExample /></Story
>

<Story
  name="Non-image Clipboard Preserves Selections"
  asChild
  tags={['!dev']}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const imageUpload = within(canvas.getByRole('region', { name: 'Image upload' }))
    const videoUpload = within(canvas.getByRole('region', { name: 'Video upload' }))
    const disabledImage = within(canvas.getByRole('region', { name: 'Disabled image upload' }))
    const disabledVideo = within(canvas.getByRole('region', { name: 'Disabled video upload' }))
    const imageFile = new File(['<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>'], 'selected.svg', { type: 'image/svg+xml' })
    await userEvent.upload(imageUpload.getByLabelText('Recipe image'), imageFile)
    await userEvent.upload(videoUpload.getByLabelText('Recipe video'), new File(['video'], 'selected.mp4', { type: 'video/mp4' }))
    await expect(videoUpload.getByText('selected.mp4')).toBeVisible()
    const preview = imageUpload.getByAltText('Aperçu').getAttribute('src')
    await expect(preview).toMatch(/^blob:/)
    for (const file of [
      new File(['pdf'], 'clipboard.pdf', { type: 'application/pdf' }),
      new File(['video'], 'clipboard.mp4', { type: 'video/mp4' }),
    ]) {
      paste([file])
      await tick()
      await expect(imageUpload.getByAltText('Aperçu')).toHaveAttribute('src', preview)
      await expect(videoUpload.getByText('selected.mp4')).toBeVisible()
      await expect(canvas.queryByRole('alert')).not.toBeInTheDocument()
    }
    paste([imageFile])
    await tick()
    await expect(disabledImage.getByAltText('Aperçu')).toHaveAttribute('src', image.url)
    await expect(disabledVideo.getByText('existing.mp4')).toBeVisible()
    await expect(disabledImage.queryByRole('alert')).not.toBeInTheDocument()
    await expect(disabledVideo.queryByRole('alert')).not.toBeInTheDocument()
  }}
>
  <div class="container">
    <StorySection title="Image upload"><Example /></StorySection>
    <StorySection title="Video upload"><VideoExample /></StorySection>
    <StorySection title="Disabled image upload"><Example disabled initialImage={image} /></StorySection>
    <StorySection title="Disabled video upload"><VideoExample disabled initialVideo={video} /></StorySection>
  </div>
</Story>

<Story
  name="VC-6 Destroy Cancels Clipboard Request"
  asChild
  tags={['!dev']}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const fetched = spyOn(globalThis, 'fetch')
    const request: { finish?: (value: Response) => void; signal?: AbortSignal | null } = {}
    fetched.mockImplementationOnce((_url, init) => {
      request.signal = init?.signal
      return new Promise((resolve) => (request.finish = resolve))
    })
    try {
      paste([], 'https://example.com/pending.png')
      await waitFor(() => expect(fetched).toHaveBeenCalledTimes(1))
      await userEvent.click(canvas.getByRole('button', { name: 'Destroy upload' }))
      await expect(request.signal?.aborted).toBe(true)
      request.finish?.(new Response('image', { headers: { 'content-type': 'image/png' } }))
      await expect(canvas.getByRole('status')).toHaveTextContent('No selection')
      paste([], 'https://example.com/no-listener.png')
      await expect(fetched).toHaveBeenCalledTimes(1)
      await userEvent.click(canvas.getByRole('button', { name: 'Mount upload' }))
      fetched.mockResolvedValueOnce(new Response('image', { headers: { 'content-type': 'image/png' } }))
      paste([], 'https://example.com/remounted.png')
      await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('remounted.png'))
      await expect(fetched).toHaveBeenCalledTimes(2)
    } finally {
      fetched.mockRestore()
    }
  }}><UploadExample /></Story
>

<style>
  .container {
    display: flex;
    flex-direction: column;
    gap: 32px;
    min-width: 0px;
    width: 100%;
  }
</style>
