<svelte:options namespace="svg" />

<script lang="ts">
  import type { IconProps } from './icon-types'
  import Icon from './icon.svelte'

  const props: IconProps = $props()
</script>

<Icon {...props}>
  <path d="M18 6L6.00081 17.9992M17.9992 18L6 6.00085" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" />
</Icon>
