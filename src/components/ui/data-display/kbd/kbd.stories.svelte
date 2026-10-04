<script module lang="ts">
  import StorySection from '@storybook-helpers/story-section.svelte'
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import KbdGroup from './kbd-group.svelte'
  import Kbd from './kbd.svelte'

  const { Story } = defineMeta({ component: Kbd, title: 'Data Display/Kbd' })
</script>

<Story name="Overview" asChild>
  <div class="container">
    <StorySection title="Default">
      <Kbd>⌘</Kbd>
    </StorySection>
    <StorySection title="Shortcut">
      <p class="text">
        Save changes with
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>S</Kbd>
        </KbdGroup>
      </p>
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

  .text {
    font-size: var(--font-sizes-sm);
  }
</style>
