<svelte:options namespace="svg" />

<script lang="ts">
  import type { IconProps } from './icon-types'
  import Icon from './icon.svelte'

  const { weight, ...props }: IconProps & { weight?: 'bold' } = $props()
</script>

<Icon {...props}>
  <path d="M5 14L8.5 17.5L19 6.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width={weight === 'bold' ? 2.5 : 1.5} />
</Icon>
