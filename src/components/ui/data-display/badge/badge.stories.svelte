<script module lang="ts">
  import StorySection from '@storybook-helpers/story-section.svelte'
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import Badge from './badge.svelte'

  const { Story } = defineMeta({ component: Badge, title: 'Data Display/Badge' })
</script>

<Story name="Overview" asChild>
  <div class="container">
    <StorySection title="Default">
      <Badge>New</Badge>
    </StorySection>
    <StorySection title="Variants">
      <div class="variant-options">
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
      <div class="size-options">
        <Badge size="sm">Small</Badge>
        <Badge>Default</Badge>
      </div>
    </StorySection>
  </div>
</Story>

<style>
  .container {
    display: flex;
    flex-direction: column;
    gap: 32px;
    min-width: 0px;
    width: 100%;
  }

  .variant-options {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .size-options {
    align-items: center;
    display: flex;
    gap: 12px;
  }
</style>
