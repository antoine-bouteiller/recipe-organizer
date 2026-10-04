<script module lang="ts">
  import StorySection from '@storybook-helpers/story-section.svelte'
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, spyOn, userEvent, within } from 'storybook/test'

  import { mobileMenuItems } from '@/components/navigation/menu-items.svelte'
  import TabBar from '@/components/navigation/tabbar.svelte'
  import Button from '@/components/ui/actions/button/button.svelte'

  import GoBackButton from './go-back-button.svelte'
  import ScreenLayout from './screen-layout.svelte'

  const { Story } = defineMeta({ component: ScreenLayout, parameters: { layout: 'padded' }, title: 'Layout/Screen Layout' })

  const backgroundImage = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="640" height="360" fill="#0e6e7e"/></svg>')}`
</script>

{#snippet content()}
  <section class="section">
    <h2 class="heading">Content</h2>
    {#each { length: 40 }, index (index)}
      <p>Item {index + 1}</p>
    {/each}
  </section>
{/snippet}

{#snippet addItem()}
  <Button size="sm">Add item</Button>
{/snippet}

{#snippet back()}
  <GoBackButton />
{/snippet}

{#snippet exampleFooter()}
  <nav aria-label="Example navigation" class="element">Navigation slot</nav>
{/snippet}

{#snippet overview()}
  <div class="story-layout">
    <p class="text">Use the viewport toolbar to compare mobile headers and desktop scrolling.</p>
    <StorySection title="Default">
      <div class="container">
        <ScreenLayout innerScrollId="story-content" outerScrollId="story-outer" title="Library">{@render content()}</ScreenLayout>
      </div>
    </StorySection>
    <StorySection title="With back action">
      <div class="container">
        <ScreenLayout backButton={back} title="Details">
          {@render content()}
        </ScreenLayout>
      </div>
    </StorySection>
    <StorySection title="With header action">
      <div class="container">
        <ScreenLayout headerEndItem={addItem} title="Library">{@render content()}</ScreenLayout>
      </div>
    </StorySection>
    <StorySection title="With long title">
      <div class="container">
        <ScreenLayout headerEndItem={addItem} title="A long recipe collection title that should truncate">{@render content()}</ScreenLayout>
      </div>
    </StorySection>
    <StorySection title="With footer">
      <div class="container">
        <ScreenLayout footer={exampleFooter} title="Library">{@render content()}</ScreenLayout>
      </div>
    </StorySection>
    <StorySection title="With background image">
      <div class="container">
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

    const back = spyOn(history, 'back').mockImplementation(() => undefined)
    try {
      await userEvent.click(backSection.getByRole('button', { name: 'Retour' }))
      await expect(back).toHaveBeenCalledTimes(1)
    } finally {
      back.mockRestore()
    }
  }}
>
  {@render overview()}
</Story>

<Story
  name="Retained Scroll IDs And Optional Navigation Slots"
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
  <div class="container" data-testid="home">
    <ScreenLayout footer={tabBar} title="Home">Content</ScreenLayout>
  </div>
  <div class="container" data-testid="detail">
    <ScreenLayout backButton={back} title="Settings">Content</ScreenLayout>
  </div>
</Story>

<style>
  .section {
    padding-block: 16px;
  }

  .heading {
    font-size: var(--font-sizes-xl);
    font-weight: var(--font-weights-semibold);
  }

  .element {
    align-items: center;
    background-color: var(--colors-background);
    border-color: var(--colors-border);
    border-top-width: 1px;
    bottom: 0;
    display: flex;
    height: 56px;
    justify-content: center;
    position: fixed;
    width: 100%;
  }

  .story-layout {
    display: flex;
    flex-direction: column;
    gap: 32px;
    min-width: 0;
    width: 100%;
  }

  .text {
    color: var(--colors-muted-foreground);
    font-size: var(--font-sizes-sm);
  }

  .container {
    border-color: var(--colors-border);
    border-radius: var(--radius-lg);
    border-width: 1px;
    display: flex;
    flex-direction: column;
    height: 384px;
    overflow: hidden;
    position: relative;
    transform: translateZ(0);
  }

  .section > :global(* + *) {
    margin-top: 16px;
  }
</style>
