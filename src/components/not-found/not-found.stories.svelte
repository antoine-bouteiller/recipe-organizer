<script module lang="ts">
  import StorySection from '@storybook-helpers/story-section.svelte'
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, within } from 'storybook/test'

  import NotFound from './not-found.svelte'

  import * as styles from './not-found.stories.css'

  const { Story } = defineMeta({ component: NotFound, title: 'Feedback/Not Found' })
</script>

{#snippet overview()}
  <div class={styles.container}>
    <StorySection title="Default">
      <NotFound />
    </StorySection>
    <StorySection title="Without Action">
      <NotFound action={null} />
    </StorySection>
  </div>
{/snippet}

<Story name="Overview" asChild>
  {@render overview()}
</Story>

<Story
  name="Home Action"
  asChild
  tags={['!dev']}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const defaultSection = within(canvas.getByRole('region', { name: 'Default' }))
    await expect(defaultSection.getByRole('link', { name: "Retour à l'accueil" })).toHaveAttribute('href', '/')
    await expect(within(canvas.getByRole('region', { name: 'Without Action' })).queryByRole('link')).not.toBeInTheDocument()
  }}
>
  {@render overview()}
</Story>
