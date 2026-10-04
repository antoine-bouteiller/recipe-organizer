<script module lang="ts">
  import StorySection from '@storybook-helpers/story-section.svelte'
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import Button from '@/components/ui/actions/button/button.svelte'

  import Card from './card.svelte'

  const { Story } = defineMeta({ component: Card, title: 'Data Display/Card' })
</script>

<Story name="Overview" asChild>
  <div class="story-layout">
    <StorySection title="Default">
      <Card>
        {#snippet title()}Recipe details{/snippet}
        {#snippet description()}A concise description of this content.{/snippet}
        <div class="container">Card content goes here.</div>
      </Card>
    </StorySection>
    <StorySection title="With Actions">
      <Card>
        {#snippet title()}Profile settings{/snippet}
        {#snippet description()}Changes are saved automatically.{/snippet}
        <div class="action-row"><Button variant="outline">Cancel</Button><Button>Save changes</Button></div>
      </Card>
    </StorySection>
    <StorySection title="Content Only"><Card><div class="content-padding">A card can be used without a header.</div></Card></StorySection>
  </div>
</Story>

<style>
  .container {
    font-size: var(--font-sizes-sm);
    padding: 24px;
    padding-top: 0px;
  }

  .story-layout {
    display: flex;
    flex-direction: column;
    gap: 32px;
    min-width: 0px;
    width: 100%;
  }

  .action-row {
    align-items: center;
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    padding: 24px;
    padding-top: 0px;
  }

  .content-padding {
    font-size: var(--font-sizes-sm);
    padding: 24px;
  }
</style>
