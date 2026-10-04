<script module lang="ts">
  import StorySection from '@storybook-helpers/story-section.svelte'
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import Label from './label.svelte'

  const { Story } = defineMeta({ component: Label, title: 'Forms/Label' })
</script>

<Story name="Overview" asChild
  ><div class="container">
    <StorySection title="Default"
      ><div class="input-example">
        <Label for="email">Email address</Label><input class="element" id="email" placeholder="name@example.com" type="email" />
      </div></StorySection
    >
    <StorySection title="Disabled"
      ><div class="disabled-input-example">
        <Label for="disabled-email">Email address</Label><input class="disabled-input" disabled id="disabled-email" value="name@example.com" />
      </div></StorySection
    >
  </div></Story
>

<style>
  .container {
    display: flex;
    flex-direction: column;
    gap: 32px;
    min-width: 0px;
    width: 100%;
  }

  .input-example {
    display: grid;
    gap: 8px;
    width: 320px;
  }

  .element {
    background-color: var(--colors-background);
    border: 1px solid;
    border-color: var(--colors-input);
    border-radius: var(--radius-md);
    font-size: var(--font-sizes-sm);
    height: 36px;
    padding-inline: 12px;
  }

  .disabled-input-example {
    display: grid;
    gap: 8px;
    width: 320px;
  }

  .disabled-input {
    background-color: var(--colors-background);
    border: 1px solid;
    border-color: var(--colors-input);
    border-radius: var(--radius-md);
    font-size: var(--font-sizes-sm);
    height: 36px;
    padding-inline: 12px;
  }

  .disabled-input:disabled {
    opacity: 0.64;
  }
</style>
