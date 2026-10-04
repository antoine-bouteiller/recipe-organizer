<script module lang="ts">
  import StorySection from '@storybook-helpers/story-section.svelte'
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import Label from './label.svelte'

  import * as styles from './label.stories.css'

  const { Story } = defineMeta({ component: Label, title: 'Forms/Label' })
</script>

<Story name="Overview" asChild
  ><div class={styles.container}>
    <StorySection title="Default"
      ><div class={styles.inputExample}>
        <Label for="email">Email address</Label><input class={styles.element} id="email" placeholder="name@example.com" type="email" />
      </div></StorySection
    >
    <StorySection title="Disabled"
      ><div class={styles.disabledInputExample}>
        <Label for="disabled-email">Email address</Label><input class={styles.disabledInput} disabled id="disabled-email" value="name@example.com" />
      </div></StorySection
    >
  </div></Story
>
