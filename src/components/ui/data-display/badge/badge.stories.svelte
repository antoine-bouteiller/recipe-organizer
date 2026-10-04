<script module lang="ts">
  import StorySection from '@storybook-helpers/story-section.svelte'
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import Badge from './badge.svelte'

  import * as styles from './badge.stories.css'

  const { Story } = defineMeta({ component: Badge, title: 'Data Display/Badge' })
</script>

<Story name="Overview" asChild>
  <div class={styles.container}>
    <StorySection title="Default">
      <Badge>New</Badge>
    </StorySection>
    <StorySection title="Variants">
      <div class={styles.variantOptions}>
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="accent">Accent</Badge>
        <Badge variant="info-subtle">Info subtle</Badge>
        <Badge variant="destructive-subtle">Destructive subtle</Badge>
        <Badge variant="neutral-subtle">Neutral subtle</Badge>
        <Badge variant="success-subtle">Success subtle</Badge>
        <Badge variant="warning-subtle">Warning subtle</Badge>
      </div>
    </StorySection>
    <StorySection title="Sizes">
      <div class={styles.sizeOptions}>
        <Badge size="sm">Small</Badge>
        <Badge>Default</Badge>
      </div>
    </StorySection>
  </div>
</Story>
