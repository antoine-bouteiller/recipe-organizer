<script module lang="ts">
  import StorySection from '@storybook-helpers/story-section.svelte'
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import Button from '@/components/ui/actions/button/button.svelte'

  import Card from './card.svelte'

  import * as styles from './card.stories.css'

  const { Story } = defineMeta({ component: Card, title: 'Data Display/Card' })
</script>

<Story name="Overview" asChild>
  <div class={styles.storyLayout}>
    <StorySection title="Default">
      <Card>
        {#snippet title()}Recipe details{/snippet}
        {#snippet description()}A concise description of this content.{/snippet}
        <div class={styles.container}>Card content goes here.</div>
      </Card>
    </StorySection>
    <StorySection title="With Actions">
      <Card>
        {#snippet title()}Profile settings{/snippet}
        {#snippet description()}Changes are saved automatically.{/snippet}
        <div class={styles.actionRow}><Button variant="outline">Cancel</Button><Button>Save changes</Button></div>
      </Card>
    </StorySection>
    <StorySection title="Content Only"><Card><div class={styles.contentPadding}>A card can be used without a header.</div></Card></StorySection>
  </div>
</Story>
