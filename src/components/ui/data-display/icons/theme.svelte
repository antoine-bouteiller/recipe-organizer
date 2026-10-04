<svelte:options namespace="svg" />

<script lang="ts">
  import type { IconProps } from './icon-types'
  import Icon from './icon.svelte'

  const props: IconProps = $props()
</script>

<Icon {...props}>
  <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" />
  <path d="M12 3l0 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" />
  <path d="M12 9l4.65 -4.65" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" />
  <path d="M12 14.3l7.37 -7.37" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" />
  <path d="M12 19.6l8.85 -8.85" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" />
</Icon>
