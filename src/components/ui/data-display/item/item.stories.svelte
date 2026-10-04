<script module lang="ts">
  import StorySection from '@storybook-helpers/story-section.svelte'
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import Button from '@/components/ui/actions/button/button.svelte'
  import { CheckIcon } from '@/components/ui/data-display/icons'

  import ItemGroup from './item-group.svelte'
  import ItemSeparator from './item-separator.svelte'
  import Item from './item.svelte'

  import * as styles from './item.stories.css'

  const { Story } = defineMeta({ component: Item, title: 'Data Display/Item' })
</script>

<Story name="Overview" asChild>
  <div class={styles.container}>
    <StorySection title="Default">
      <Item>
        {#snippet media()}<CheckIcon />{/snippet}
        {#snippet title()}Saved recipe{/snippet}
        Keep this recipe in your collection.
      </Item>
    </StorySection>
    <StorySection title="Variants">
      <div class={styles.variantList}>
        <Item>{#snippet media()}<CheckIcon />{/snippet}{#snippet title()}Default{/snippet}A standard item.</Item>
        <Item variant="outline">{#snippet media()}<CheckIcon />{/snippet}{#snippet title()}Outline{/snippet}An outlined item.</Item>
      </div>
    </StorySection>
    <StorySection title="Row layout">
      <Item layout="row">
        {#snippet actions()}<Button size="sm">View</Button>{/snippet}
        {#snippet media()}<CheckIcon />{/snippet}
        {#snippet title()}Pasta primavera{/snippet}
        Open the recipe to review its ingredients.
      </Item>
    </StorySection>
    <StorySection title="Group">
      <ItemGroup>
        <Item>{#snippet title()}First item{/snippet}A grouped item.</Item>
        <ItemSeparator />
        <Item>{#snippet title()}Second item{/snippet}Another grouped item.</Item>
      </ItemGroup>
    </StorySection>
  </div>
</Story>
