<script lang="ts">
  interface SkeletonProps {
    preset?:
      | 'recipe-card'
      | 'recipe-details-text'
      | 'recipe-details-title'
      | 'search-input'
      | 'search-result'
      | 'shopping-list-row'
      | 'shopping-list-title'
  }
  const { preset }: SkeletonProps = $props()
</script>

<div
  aria-hidden="true"
  class={[
    'skeleton',
    {
      'preset-recipe-card': preset === 'recipe-card',
      'preset-recipe-details-text': preset === 'recipe-details-text',
      'preset-recipe-details-title': preset === 'recipe-details-title',
      'preset-search-input': preset === 'search-input',
      'preset-search-result': preset === 'search-result',
      'preset-shopping-list-row': preset === 'shopping-list-row',
      'preset-shopping-list-title': preset === 'shopping-list-title',
    },
  ]}
  data-slot="skeleton"
></div>

<style>
  .skeleton {
    --skeleton-highlight: color-mix(in srgb, white 64%, transparent);
    animation: var(--animations-skeleton);
    background: linear-gradient(120deg, transparent 40%, var(--skeleton-highlight), transparent 60%) var(--colors-muted) 0 0 / 200% 100% fixed;
    border-radius: var(--radius-sm);
  }
  :global(.dark) .skeleton {
    --skeleton-highlight: color-mix(in srgb, white 4%, transparent);
  }
  .preset-recipe-card {
    border-radius: var(--radius-4xl);
    height: 240px;
  }
  .preset-recipe-details-text {
    height: 20px;
    width: 100%;
  }
  .preset-recipe-details-title {
    border-radius: var(--radius-lg);
    height: 40px;
    width: 100%;
  }
  .preset-search-input {
    border-radius: var(--radius-xl);
    height: 44px;
    width: 100%;
  }
  .preset-search-result {
    border-radius: var(--radius-2xl);
    height: 80px;
    width: 100%;
  }
  .preset-shopping-list-row {
    height: 32px;
    width: 100%;
  }
  .preset-shopping-list-title {
    height: 24px;
    width: 128px;
  }
</style>
