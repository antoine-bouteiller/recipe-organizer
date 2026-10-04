<script module lang="ts">
  import StorySection from '@storybook-helpers/story-section.svelte'
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import KbdGroup from './kbd-group.svelte'
  import Kbd from './kbd.svelte'

  import * as styles from './kbd.stories.css'

  const { Story } = defineMeta({ component: Kbd, title: 'Data Display/Kbd' })
</script>

<Story name="Overview" asChild>
  <div class={styles.container}>
    <StorySection title="Default">
      <Kbd>⌘</Kbd>
    </StorySection>
    <StorySection title="Shortcut">
      <p class={styles.text}>
        Save changes with
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>S</Kbd>
        </KbdGroup>
      </p>
    </StorySection>
  </div>
</Story>
