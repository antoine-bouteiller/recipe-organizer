<script module lang="ts">
  import StorySection from '@storybook-helpers/story-section.svelte'
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, userEvent, within } from 'storybook/test'

  import { mobileMenuItems } from '@/components/navigation/menu-items.svelte'
  import TabBar from '@/components/navigation/tabbar.svelte'
  import Button from '@/components/ui/actions/button/button.svelte'

  import GoBackButton from './go-back-button.svelte'
  import ScreenLayout from './screen-layout.svelte'

  import * as styles from './screen-layout.stories.css'

  const { Story } = defineMeta({ component: ScreenLayout, parameters: { layout: 'padded' }, title: 'Layout/Screen Layout' })

  const backgroundImage = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="640" height="360" fill="#0e6e7e"/></svg>')}`
</script>

<script lang="ts">
  let requested = $state(false)
</script>

{#snippet content()}
  <section class={styles.section}>
    <h2 class={styles.heading}>Content</h2>
    {#each { length: 40 }, index (index)}
      <p>Item {index + 1}</p>
    {/each}
  </section>
{/snippet}

{#snippet addItem()}
  <Button size="sm">Add item</Button>
{/snippet}

{#snippet back()}
  <GoBackButton onBack={() => (requested = true)} />
{/snippet}

{#snippet exampleFooter()}
  <nav aria-label="Example navigation" class={styles.element}>Navigation slot</nav>
{/snippet}

{#snippet overview()}
  <div class={styles.storyLayout}>
    <p class={styles.text}>Use the viewport toolbar to compare mobile headers and desktop scrolling.</p>
    <StorySection title="Default">
      <div class={styles.container}>
        <ScreenLayout innerScrollId="story-content" outerScrollId="story-outer" title="Library">{@render content()}</ScreenLayout>
      </div>
    </StorySection>
    <StorySection title="With back action">
      <div class={styles.container}>
        <ScreenLayout backButton={back} title="Details">
          {#if requested}<p role="status">Back action requested.</p>{/if}
          {@render content()}
        </ScreenLayout>
      </div>
    </StorySection>
    <StorySection title="With header action">
      <div class={styles.container}>
        <ScreenLayout headerEndItem={addItem} title="Library">{@render content()}</ScreenLayout>
      </div>
    </StorySection>
    <StorySection title="With long title">
      <div class={styles.container}>
        <ScreenLayout headerEndItem={addItem} title="A long recipe collection title that should truncate">{@render content()}</ScreenLayout>
      </div>
    </StorySection>
    <StorySection title="With footer">
      <div class={styles.container}>
        <ScreenLayout footer={exampleFooter} title="Library">{@render content()}</ScreenLayout>
      </div>
    </StorySection>
    <StorySection title="With background image">
      <div class={styles.container}>
        <ScreenLayout {backgroundImage} title="Library">{@render content()}</ScreenLayout>
      </div>
    </StorySection>
  </div>
{/snippet}

{#snippet tabBar()}
  <TabBar currentPath="/" items={mobileMenuItems} />
{/snippet}

<Story name="Overview" asChild>
  {@render overview()}
</Story>

<Story name="Mobile" asChild globals={{ viewport: { isRotated: false, value: 'mobile2' } }}>
  {@render overview()}
</Story>

<Story
  name="Interaction"
  asChild
  globals={{ viewport: { isRotated: false, value: 'mobile2' } }}
  tags={['!dev']}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const backSection = within(canvas.getByRole('region', { name: 'With back action' }))

    await userEvent.click(backSection.getByRole('button', { name: 'Retour' }))
    await expect(backSection.getByRole('status')).toHaveTextContent('Back action requested.')
  }}
>
  {@render overview()}
</Story>

<Story
  name="Scroll And Footer Semantics"
  asChild
  tags={['!dev']}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const home = within(canvas.getByTestId('home'))
    const detail = within(canvas.getByTestId('detail'))
    await expect(canvasElement.querySelector('[data-testid=home] [data-scroll-restoration-id=screen-outer]')).not.toBeNull()
    await expect(canvasElement.querySelector('[data-testid=home] [data-scroll-restoration-id=screen-inner]')).not.toBeNull()
    await expect(home.getByRole('link', { name: 'Accueil' })).toHaveAttribute('aria-current', 'page')
    await expect(home.queryByRole('button', { name: 'Retour' })).not.toBeInTheDocument()
    await expect(detail.getByRole('button', { name: 'Retour' })).toBeVisible()
    await expect(detail.queryByRole('navigation')).not.toBeInTheDocument()
  }}
>
  <div class={styles.container} data-testid="home">
    <ScreenLayout footer={tabBar} title="Home">Content</ScreenLayout>
  </div>
  <div class={styles.container} data-testid="detail">
    <ScreenLayout backButton={back} title="Settings">Content</ScreenLayout>
  </div>
</Story>
